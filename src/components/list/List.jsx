import React, { useState } from 'react';
import { SlOptionsVertical } from "react-icons/sl";
import { BsCamera } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import Chatlist from './Chatlist';
import { BiSolidMessageAdd } from "react-icons/bi";
import Adduser from './Adduser';
import { useSelector } from 'react-redux';

const List = () => {
  const [fetchChats, setfetchChats] = useState(null)
  const [openBox, setOpenBox] = useState(false)
  // const display = useSelector(state => state.display)
  // setfetchChats(fetchChats)

  return (
    <div className='flex flex-col h-full overflow-hidden  md:w-80 relative lg:w-96'>
      <div className='flex justify-between p-2 mx-2 mt-2'>
        <h1 className='font-semibold text-xl tracking-wider lg:pl-2'>TOLPA</h1>
        <div className='flex justify-between gap-4'>
          <h1 className='text-2xl'><BsCamera /></h1>
          <h1 className='mt-1'><SlOptionsVertical /></h1>
        </div>
      </div>

      <div className='px-2 mt-1 mb-4 mx-2'>
        <div className="flex gap-8 text-center bg-black/25 p-2 rounded-md">
          <div className='w-5 h-5'>
            <img src="./search.png" alt="" />
          </div>
          <input type="text" placeholder="Buscar" className=' bg-transparent w-40' />
        </div>
      </div>

      <div className='flex-1 overflow-y-auto pl-2'> {/* Added overflow-y-auto here */}
        <Chatlist />
      </div>

      <div className='absolute bottom-12 right-4 text-4xl bg-[#5082FC] w-12 h-12 flex justify-center text-center pt-2 rounded-md'>
        <BiSolidMessageAdd className='' onClick={() => setOpenBox((prev)=>!prev)} />
      </div>

      {openBox && <div className='absolute top-1/2 left-4'>
        <Adduser setOpenBox = {setOpenBox}/>
      </div>
      }
    </div>
  );
}

export default List;
