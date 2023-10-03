//import React from 'react'
import { BsFacebook, BsGithub, BsInstagram, BsLinkedin } from 'react-icons/bs'
export default function footer() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
  return (
    <>
      <footer className="relative left-0 bottom-0 h-[10vh] flex flex-col sm:flex-row items-center justify-between bg-grey-800 text-white sm:px-20">
         <section className="text-lg">
            Copyright {year} || All rights reserved
         </section>

         <section className="flex items-center justify-center gap-5 text-2xl text-white">
            <a href="" className="hover:text-yellow-500 transition-all ease-in-out duration-300">
                <BsFacebook/>
            </a>
            <a href="" className="hover:text-yellow-500 transition-all ease-in-out duration-300">
                <BsLinkedin/>
            </a>
            <a href="" className="hover:text-yellow-500 transition-all ease-in-out duration-300">
                <BsInstagram/>
            </a>
            <a href="" className="hover:text-yellow-500 transition-all ease-in-out duration-300">
                <BsGithub/>
            </a>
         </section>
      </footer>
    </>
  )
}
