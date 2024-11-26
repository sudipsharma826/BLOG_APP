import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble, BsLinkedin, BsPersonBadge } from 'react-icons/bs';
export default function FooterPage() {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Link
              to='/'
              className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'
            >
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                Sudip's
              </span>
              Blog
             </Link>
             <p className="mt-4 font-semibold text-gray-500 ">
          Join a growing community of readers and writers! 🔥
        </p> 
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <Footer.Title title='About' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='https://sudipsharma.info.np'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Sudip Sharma
                </Footer.Link>
                <Footer.Link
                  href='/projects'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Projects
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Follow us' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='https://github.com/sudipsharma826'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Github
                </Footer.Link>
                <Footer.Link href='https://www.linkedin.com/in/sudipsharmanp/'>LinkedIn</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Legal' />
              <Footer.LinkGroup col>
                <Footer.Link href='/privacypolicy'>Privacy Policy</Footer.Link>
                <Footer.Link href='/termsandconditions'>Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright
            href='https://sudipsharma.info.np'
            by="Sudip Sharma"
            year={new Date().getFullYear()}
           
          />
          <img src="images/logo.png" alt="logo" className="w-17 h-10 " />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href='https://www.facebook.com/sudipsharma.np/' icon={BsFacebook}/>
            <Footer.Icon href='https://www.linkedin.com/in/sudipsharmanp/' icon={BsLinkedin}/>
            <Footer.Icon href='https://www.instagram.com/sudeep_sharma.np/' icon={BsInstagram}/>
            <Footer.Icon href='https://github.com/sudipsharma826/' icon={BsGithub}/>
            <Footer.Icon href='https://sudipsharma.info.np' icon={BsPersonBadge}/>

          </div>
        </div>
      </div>
    </Footer>
  );
}