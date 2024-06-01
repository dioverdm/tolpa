import React from 'react'
import { FiArrowLeft } from "react-icons/fi";
import { SlOptionsVertical } from "react-icons/sl";
import { useDispatch } from 'react-redux';
import { setDetailsPage } from '../../Redux/slices/detailsSlice';
import { firebaseAuth, useFirebase } from '../../firebase/Firebase';
import { useUserStore } from '../../zustand/userStore';
import { useChatStore } from '../../zustand/chatStore';


const Details = () => {
  const dispatch = useDispatch()
  const firebase = useFirebase()

  const handleChat = ()=>{
    dispatch(setDetailsPage(false))
  }

  const { user } = useChatStore()
  console.log(user)

  return (
    <>
      <div className='flex flex-col px-2 pt-4 md:w-72'>
        <div className='flex flex-col justify-center text-center gap-3 mb-4'>
          <div className='flex justify-between px-3'>
            <h1 onClick={handleChat}
            ><FiArrowLeft /></h1>
            <div>
              <img src={user?.avatar || "./avatar.png"} alt="" className='w-16 h-16 rounded-full mx-auto' />
            </div>
            <h1><SlOptionsVertical /></h1>
          </div>
          <h1 className='font-semibold text-lg'>{user?.username}</h1>
          <span className='text-xs font-thin'>Información del usuario</span>
        </div>
        <hr className='opacity-15' />

        <div className='flex flex-col gap-4 px-4 pt-4'>
          <div className='flex justify-between'>
            <h3 className='text-sm mt-1'>Configuraciones del chat</h3>
            <div className='bg-black/25 p-2 rounded-full'
            ><img src="./arrowDown.png" alt="" className='w-3 h-3 rounded-full' /></div>
          </div>

          <div className='flex justify-between'>
            <h3 className='text-sm mt-1'>Privacidad y Ayuda</h3>
            <div className='bg-black/25 p-2 rounded-full'
            ><img src="./arrowDown.png" alt="" className='w-3 h-3 rounded-full' /></div>
          </div>


          <div className='flex justify-between'>
            <h3 className='text-sm mt-1'>Fotos compartidas</h3>
            <div className='bg-black/25 p-2 rounded-full'
            ><img src="./arrowUp.png" alt="" className='w-3 h-3 rounded-full' /></div>
          </div>

          <div className='flex justify-between'>
            <div className='flex gap-2 text-center justify-center'>
              <div className=''>
                <img src="./avatar.png" alt="" className='w-8 h-8 rounded-lg' />
              </div>
              <h3 className='mt-2 text-xs'>Photo_avatar_2.png</h3>
            </div>
            <div className='bg-black/25 rounded-full p-2'>
              <img src="./download.png" alt="" className='w-3 h-3' />

            </div>
          </div>

          <div className='flex justify-between'>
            <div className='flex gap-2 text-center justify-center'>
              <div className=''>
                <img src="./avatar.png" alt="" className='w-8 h-8 rounded-lg' />
              </div>
              <h3 className='mt-2 text-xs'>Photo_avatar_2.png</h3>
            </div>
            <div className='bg-black/25 rounded-full p-2'>
              <img src="./download.png" alt="" className='w-3 h-3' />

            </div>
          </div>


          <div className='flex justify-between'>
            <div className='flex gap-2 text-center justify-center'>
              <div className=''>
                <img src="./avatar.png" alt="" className='w-8 h-8 rounded-lg' />
              </div>
              <h3 className='mt-2 text-xs'>Photo_avatar_2.png</h3>
            </div>
            <div className='bg-black/25 rounded-full p-2'>
              <img src="./download.png" alt="" className='w-3 h-3' />

            </div>
          </div>
        </div>

        <div className='flex flex-col gap-3 mt-6 md:mt-8'>
          <button className='bg-red-500 rounded-md p-1.5 text-sm flex justify-center text-center w-full'>Bloquear usuario</button>
          <button className='bg-[#5082FC] rounded-md p-1.5 text-sm flex justify-center text-center w-full'
          onClick={()=>firebase.signOut(firebaseAuth)}>Cerrar Sesión</button>
        </div>


      </div>
    </>
  )
}

export default Details