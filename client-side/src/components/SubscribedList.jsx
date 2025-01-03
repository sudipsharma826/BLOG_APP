import { useState, useEffect } from "react";
import { Table, Button, Modal, TextInput, Spinner } from "flowbite-react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import axios from "axios";
import { useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function SubscribedList() {
  const [subscribedUsers, setSubscribedUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [emailData, setEmailData] = useState({ subject: "", message: "" });
  const [image, setImage] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchSubscribedUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/getSubscribeList`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${currentUser.currentToken}`,
            },
          }
        );
        setSubscribedUsers(response.data.subscribedUsers);
      } catch (error) {
        console.error("Error fetching subscribed users:", error);
      }
    };
    fetchSubscribedUsers();
  }, [currentUser.currentToken]);

  const handleSelectUser = (email) => {
    setSelectedUsers((prev) =>
      prev.includes(email)
        ? prev.filter((user) => user !== email)
        : [...prev, email]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleSendMail = () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleSendEmailAPI = async () => {
    if (!emailData.subject || !emailData.message) {
      alert("Please fill in all email fields.");
      return;
    }

    const formData = new FormData();
    formData.append("subject", emailData.subject);
    formData.append("message", emailData.message);
    formData.append("email", JSON.stringify(selectedUsers));
    if (image) {
      formData.append("image", image);
    }

    console.log("FormData content:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    setIsSending(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_APP_BASE_URL}/user/sendEmail`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${currentUser.currentToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Emails sent successfully!");
      setIsModalOpen(false);
      setEmailData({ subject: "", message: "" });
      setSelectedUsers([]);
      setImage(null);
      setPreviewImage(null);
    } catch (error) {
      console.error("Error sending emails:", error.response?.data || error.message);
      alert("Failed to send emails.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Subscribed Users</h1>

      {subscribedUsers.length > 0 ? (
        <>
          <Table striped>
            <Table.Head>
              <Table.HeadCell>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked
                      ? setSelectedUsers(subscribedUsers.map((u) => u.email))
                      : setSelectedUsers([])
                  }
                  checked={
                    selectedUsers.length === subscribedUsers.length &&
                    subscribedUsers.length > 0
                  }
                />
              </Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Is User</Table.HeadCell>
              <Table.HeadCell>Subscribed Date</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {subscribedUsers.map((user) => (
                <Table.Row key={user.email}>
                  <Table.Cell>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.email)}
                      onChange={() => handleSelectUser(user.email)}
                    />
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isUser ? (
                      <FiCheckCircle className="text-green-500" />
                    ) : (
                      <FiXCircle className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(user.subscribeDate).toLocaleDateString()}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          <div className="mt-4">
            <Button onClick={handleSendMail}>Send Email</Button>
          </div>
        </>
      ) : (
        <div className="text-center text-2xl font-bold text-red-900 dark:text-white">
          No Subscribed User Found
        </div>
      )}

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Draft Email</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <TextInput
              id="subject"
              type="text"
              placeholder="Subject"
              value={emailData.subject}
              onChange={(e) =>
                setEmailData((prev) => ({ ...prev, subject: e.target.value }))
              }
            />
            <ReactQuill
              theme="snow"
              value={emailData.message}
              onChange={(content) =>
                setEmailData((prev) => ({ ...prev, message: content }))
              }
              placeholder="Compose your message here..."
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ color: [] }, { background: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["blockquote", "code-block"],
                  ["link","image"],
                ],
              }}
            />
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="block mt-2"
            />
            {previewImage && (
              <div className="flex justify-center mt-4">
                <img
                  src={previewImage}
                  alt="Selected"
                  className="rounded-md max-h-60"
                />
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSendEmailAPI} disabled={isSending}>
            {isSending ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" light /> Sending...
              </div>
            ) : (
              "Send Email"
            )}
          </Button>
          <Button
            color="gray"
            onClick={() => setIsModalOpen(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
