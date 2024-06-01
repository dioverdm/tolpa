import React, { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { doc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setSignupPage } from '../../Redux/slices/signupSlice';
import upload from '../../firebase/upload';
import { db, useFirebase } from '../../firebase/Firebase';
import { toast } from 'react-toastify';

const Signup = () => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState({
    file: null,
    url: ''
  });

  const SignupSchema = Yup.object().shape({
    email: Yup.string().email('Correo electrónico inválido').required('Se requiere un correo electrónico'),
    password: Yup.string().required('Se requiere una contraseña segura').min(6).max(10),
    username: Yup.string().required('Se requiere nombre de usuario')
  });

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      const response = await firebase.signupUserWithEmailAndPass(values.email, values.password);
      console.log("I am response:",response)
      let imgUrl = '';
      if (avatar.file) {
        imgUrl = await upload(avatar.file);
      }
      await setDoc(doc(db, "users", response.user.uid), {
        username: values.username,
        email: values.email,
        avatar: imgUrl,
        id: response.user.uid,
        blocked: [],
      });

      dispatch(setSignupPage(true));

      await setDoc(doc(db, "userchats", response.user.uid), {
        chats: [],
      });

      toast.success("¡Cuenta creada! ¡Puedes iniciar sesión ahora!");
    } catch (error) {
      toast.error(err.message);
    }
  };

  return (
    <div className='flex flex-col items-center pt-5 px-3'>
      <div className='w-full max-w-md'>
        <h1 className='text-xl font-bold text-center mb-4 md:text-3xl md:font-bold'>Step into ChatPlace</h1>
        <p className='text-lg text-center mb-4 text-[#76BDFF] md:font-mono md:font-semibold'>¡Bienvenido al chat de tolpa!</p>
        <div className='rounded-lg p-3'>
          <Formik
            initialValues={{ email: '', password: '', username: '' }}
            validationSchema={SignupSchema}
            onSubmit={(values, actions) => {
              handleSubmit(values, actions);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className='flex mb-2 md:mb-4'>
                  <label htmlFor="file" className='text-xs flex gap-5 md:text-sm'>
                    <img src={avatar.url || "./avatar.png"} alt="" className='w-10 h-10 rounded-md object-cover md:w-16 md:h-16' />
                    <span className='mt-3 underline md:mt-5'>Subir una imagen</span>
                  </label>
                  <input
                    type="file"
                    id="file"
                    style={{ display: "none" }}
                    onChange={handleAvatar}
                  />
                </div>
                <Field
                  type='text'
                  id='username'
                  name='username'
                  placeholder='Nombre de usuario'
                  className='w-full px-4 py-2 mb-1 text-black bg-gray-100 border border-gray-300 rounded-lg focus:outline-none
                   focus:border-indigo-500'
                />
                <ErrorMessage name='username' component='div' className='text-red-300 text-xs' />

                <Field
                  type='email'
                  id='email'
                  name='email'
                  placeholder='Correo Electrónico'
                  className='w-full px-4 py-2 mt-3 mb-1 text-black bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500'
                />
                <ErrorMessage name='email' component='div' className='text-red-300 text-xs' />

                <Field
                  type='password'
                  id='password'
                  name='password'
                  placeholder='Elije una contraseña'
                  className='w-full px-4 py-2 mt-3 mb-1 text-black bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500'
                />
                <ErrorMessage name='password' component='div' className='text-red-300 text-xs' />

                <button
                  type='submit'
                  className='w-full px-2 py-2 mt-3 text-lg text-white bg-[#5082FC] rounded-lg hover:bg-sky-500 focus:outline-none'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registrando...' : 'Registrarme'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <div className='mt-1 text-center px-6'>
          <p className='text-sm'>¿Ya tienes una cuenta?</p>
          <button onClick={()=>dispatch(setSignupPage(true))}
           className='text-[#5082FC] cursor-pointer'>
            Acceder
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
