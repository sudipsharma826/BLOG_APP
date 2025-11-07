import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function DashboardComp() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);

  const { currentUser } = useSelector((state) => state.user);
  const BASE_URL = import.meta.env.VITE_BACKEND_APP_BASE_URL;

  useEffect(() => {
    if (!currentUser?.isAdmin) {
      navigate("/");
      return;
    }

    const fetchData = async (endpoint, setters) => {
      try {
        const res = await axios.get(`${BASE_URL}${endpoint}`,{
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        if (res.status === 200) {
          setters.forEach(([setter, key]) => setter(res.data[key]));
        } else {
          console.error(`Error: Received status ${res.status}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData("/user/getUsers?limit=5", [
      [setUsers, "users"],
      [setTotalUsers, "totalUsers"],
      [setLastMonthUsers, "lastMonthUsers"],
    ]);

    fetchData("/post/getposts?limit=5", [
      [setPosts, "posts"],
      [setTotalPosts, "totalPosts"],
      [setLastMonthPosts, "lastMonthPosts"],
    ]);

    fetchData("/comment/getcomments?limit=5", [
      [setComments, "comments"],
      [setTotalComments, "totalComments"],
      [setLastMonthComments, "lastMonthComments"],
    ]);
  }, [currentUser, navigate, BASE_URL]);

  return (
    <div className="p-3 md:mx-auto">
      {/* Dashboard summary cards */}
      <div className="flex-wrap flex gap-4 justify-center">
        <DashboardCard
          title="Total Users"
          total={totalUsers}
          lastMonthCount={lastMonthUsers}
          icon={<HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />}
        />
        <DashboardCard
          title="Total Comments"
          total={totalComments}
          lastMonthCount={lastMonthComments}
          icon={<HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />}
        />
        <DashboardCard
          title="Total Posts"
          total={totalPosts}
          lastMonthCount={lastMonthPosts}
          icon={<HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />}
        />
      </div>

      {/* Data Tables */}
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <DataTable title="Recent Users" data={users} columns={[{ header: "User Image", accessor: "photoURL", isImage: true }, { header: "Username", accessor: "username" }]} linkTo="/dashboard?tab=users" />
        <DataTable title="Recent Comments" data={comments} columns={[{ header: "Comment Content", accessor: "content", isTruncated: true }, { header: "Likes", accessor: "numberOfLikes" }]} linkTo="/dashboard?tab=comments" />
        <DataTable title="Recent Posts" data={posts} columns={[{ header: "Post Image", accessor: "image", isImage: true }, { header: "Post Title", accessor: "title" }, { header: "Category", accessor: "category" }]} linkTo="/dashboard?tab=posts" />
      </div>
    </div>
  );
}

function DashboardCard({ title, total, lastMonthCount, icon }) {
  return (
    <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
      <div className="flex justify-between">
        <div>
          <h3 className="text-gray-500 text-md uppercase">{title}</h3>
          <p className="text-2xl">{total}</p>
        </div>
        {icon}
      </div>
      <div className="flex gap-2 text-sm">
        <span className="text-green-500 flex items-center">
          <HiArrowNarrowUp />
          {lastMonthCount}
        </span>
        <div className="text-gray-500">Last month</div>
      </div>
    </div>
  );
}

function DataTable({ title, data, columns, linkTo }) {
  return (
    <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
      <div className="flex justify-between p-3 text-sm font-semibold">
        <h1 className="text-center p-2">{title}</h1>
        <Button outline gradientDuoTone="purpleToPink">
          <Link to={linkTo}>See all</Link>
        </Button>
      </div>
      <Table hoverable>
        <Table.Head>
          {columns.map((col) => (
            <Table.HeadCell key={col.header}>{col.header}</Table.HeadCell>
          ))}
        </Table.Head>
        {data?.map((item) => (
          <Table.Body key={item._id} className="divide-y">
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              {columns.map((col) => (
                <Table.Cell key={col.header}>
                  {col.isImage ? (
                    <img src={item[col.accessor]} alt={col.header} className="w-10 h-10 rounded-full bg-gray-500" />
                  ) : col.isTruncated ? (
                    <p className="line-clamp-2">{item[col.accessor]}</p>
                  ) : (
                    item[col.accessor]
                  )}
                </Table.Cell>
              ))}
            </Table.Row>
          </Table.Body>
        ))}
      </Table>
    </div>
  );
}
