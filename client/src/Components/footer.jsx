//import React from 'react'
import {} from 'react-icons/bs'
export default function footer() {
    const currentDate = new Date();
    const year = currentDate.getFullYear
  return (
    <>
      <footer className="relative left-0 bottom-0 h-[10vh] flex flex-col sm:flex-row items-center justify-between bg-grey-800 text-white sm:px-20">
         <section className="text-lg">
            Copyright {year} || All rights reserved
         </section>
      </footer>
    </>
  )
}
