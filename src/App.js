import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect,useRef } from 'react';
import { getFirestore, collection, addDoc,getDocs,onSnapshot,doc,deleteDoc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage,ref, uploadBytes,listAll,getDownloadURL } from 'firebase/storage';
import { firebase } from './firebase';
import { v4 } from 'uuid';
import { Modal } from 'flowbite';
import InsertModal from './insertModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FaPlus } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import 'firebase/compat/storage';
import EditModal from './EditModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const firebaseConfig = {
  apiKey: "AIzaSyDdq4zPAzGgWOroYFjQHzHUqPAqL_xE7O0",
  authDomain: "museumapp-42cda.firebaseapp.com",
  projectId: "museumapp-42cda",
  storageBucket: "museumapp-42cda.appspot.com",
  messagingSenderId: "652751305131",
  appId: "1:652751305131:web:5c0f01597ad2cc99b8baee",
  measurementId: "G-RKPSHS4BVF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

function App({noitfy}) {
  const [Name, setName] = useState('');
  const [Detail, setDetail] = useState('');
  const [Address, setAddress] = useState('');
  const [Date, setDate] = useState('');
  const [Type, setType] = useState('');
  const [fetchedData, setFetchedData] = useState([]);
  const nameRef = useRef(null);
  const detailRef = useRef(null);
  const addressRef = useRef(null);
  const dateRef = useRef(null);
  const typeRef = useRef(null);
  const [ImgUpload,setImg] = useState()
  const [ImgList,setImgList] = useState([])
  const [openModalInsert , setOpenModalInsert] = useState(false);
  const [openModal , setOpenModal] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [editData, setEditData] = useState();
  const [originalData, setOriginalData] = useState([]);
  const ImgListRef = ref(storage,"images/")

  // useEffect(() => {
  //   const fetchImageUrls = async () => {
  //     const urls = await Promise.all(
  //       fetchedData.map(async (item) => {
  //         const storageRef = ref(storage, `images/${item.id}.jpg`);
  //         try {
  //           const url = await storageRef.getDownloadURL();
  //           return url;
  //         } catch (error) {
  //           console.error(`Error fetching image for ${item.id}:`, error);
  //           return null;
  //         }
  //       })
  //     );
  //     setImageUrls(urls);
  //   };

  //   fetchImageUrls();
  // }, [fetchedData]);
 
  const noti = () => {
    toast.success('Successfully', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  };
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'MuseumApp'), (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setFetchedData(data);
      setOriginalData(data);
    });
  
    return () => unsubscribe();
  }, []);

  function handleFilter(searchTerm) {
    if (searchTerm.trim() === "") {
      setFetchedData(originalData);
      // console.log("Empty");
    } else {
      const SearchData = originalData.filter((user) =>
        user.Name.toUpperCase().includes(searchTerm.toUpperCase())
      );
      setFetchedData(SearchData);
      // console.log("Filtered Data:", filteredData);
    }
  }
  function DeleteData(key) {
    try {
      const isConfirmed = window.confirm("คุณต้องการลบใช่ไหม ?");
      if (isConfirmed) {
        deleteDoc(doc(db, "MuseumApp", key));
        console.log("Document successfully deleted!");
      } else {
        console.log("Deletion canceled by user");
      }
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  }
  
  return (
  <div>
    <ToastContainer />
    <div className='flex justify-center'>
<div className="flex flex-col mt-6 container shadow-2xl w-[100rem]">
           <div className="-mx-4 -my-2  sm:-mx-6 lg:-mx-8 ">
            <div className="inline-block w-full py-2 align-middle md:px-6 lg:px-8 ">
                <div className="overflow-hidden md:rounded-lg shadow p-3">
                <div className="container ">
                <div className="grid grid-cols-2 gap-4 ">
        <div  className="mt-3">
            <p className="text-3xl prompt">รายชื่อพิพิธภัณฑ์</p>
        </div>
        <div className="flex justify-end ">
        <button
                type="button"
                className="flex h-12 px-5 m-2 text-white  bg-blue-700 focus:ring-4  focus:ring-blue-300  rounded-lg py-2.5 text-center mr-2 mb-2"
                onClick={() => {
                  setOpenModalInsert(true);
                }}
              >
                <FaPlus className='mr-5 mt-1' style={{fontSize:"20px"}}/>
                <p className='mr-2' style={{ fontSize:"15px"}}>
                เพิ่มข้อมูลอาหาร
                </p>
              </button>
              {/* Pass the openModal state to InsertModal component */}
              {openModalInsert && <InsertModal openModalInsert={openModalInsert} setOpenModalInsert={setOpenModalInsert} noti={noti} />}
            </div>
        </div>
        </div>
    
    <hr/>
    <div className="relative flex justify-end mb-3 mt-2">
            <div className="mr-4 text-l font-medium  text-gray-500 dark:text-gray-400 mt-2">
                <label for="">Seach: </label>
            </div>
            <input type="text" placeholder="" className="shadow-md block w-[15rem] py-2 text-gray-700 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:border-blue-400 focus:ring-blue-500  focus:ring-2 focus:ring-opacity-40" name="search"
            onChange={(event)=>{
              handleFilter(event.target.value)
            }}
            />
        </div>
                    <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className=" bg-gray-100 dark:bg-gray-900">
                            <tr>
                    <th scope="col" className="px-6 py-3  text-l font-normal  text-gray-500 dark:text-gray-400">ลำดับ</th>
                    <th scope="col" className="px-3 py-3  text-l font-normal  text-gray-500 dark:text-gray-400">รูปภาพพิพิธภัณฑ์</th>
                    <th scope="col" className="px-6 py-3  text-l font-normal  text-gray-500 dark:text-gray-400">ชื่อพิพิธภัณฑ์</th>
                    {/* <th scope="col" className="px-6 py-3  text-l font-normal  text-gray-500 dark:text-gray-400">รายละเอียดพิพิธภัณฑ์</th> */}
                    <th scope="col" className="px-6 py-3  text-l font-normal  text-gray-500 dark:text-gray-400">เวลาทำการ</th>
                    {/* <th scope="col" className="px-6 py-3  text-l font-normal  text-gray-500 dark:text-gray-400">ประเภทพิพิธภัณฑ์</th> */}
                    <th></th>
                </tr>
        </thead>
        <tbody>
        {fetchedData.map((item,index) => (
  <tr key={item.Id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 mt-5">
    <td className="px-6 py-3 font-normal text-gray-60">{index+1}</td>
      <td  className="px-4 py-2 font-normal text-gray-60">
        <img alt="Food" src={item.ImageUrls[0]} width={150} height={100} className="rounded-lg thumbnail" />
      </td>
      <td className='px-6 py-3 font-normal text-gray-60'>{item.Name}</td>
      {/* <td className='px-6 py-3 font-normal text-gray-60'>{item.Detail}</td> */}
      <td className='px-6 py-3 font-normal text-gray-60'>{item.Date}</td>
      {/* <td className='px-6 py-3 font-normal text-gray-60'>{item.Type}</td> */}
      <td className='flex mt-5'>
        <button
          type="button"
          className=" px-3 m-2 text-white bg-blue-700  focus:ring-4 focus:ring-blue-300 rounded-lg text-center mr-2 mb-2 flex"
          onClick={() => {
            setOpenModal(true);
            setEditData(item);
          }}
          style={{height:"40px",marginTop:"10px"}}
        >
        <FontAwesomeIcon icon={faPenToSquare} style={{fontSize:"19px", marginTop:"10px"}} />
        </button>
        
        <button type="button" 
        className="text-red-600 inline-flex justify-center items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
          onClick={() => {
            DeleteData(item.id);
          }}
          style={{height:"40px",marginTop:"10px", width:10}}
        >
        <FontAwesomeIcon icon={faTrashCan} style={{fontSize:"19px"}}/>

                </button>
      </td>
    </tr>
))}
{openModal && (
  <EditModal openModal={openModal} setOpenModal={setOpenModal} editData={editData} noti={noti} />
)}
        </tbody>
                        </table>
</div>
  </div>
  </div>
  </div>
  </div>
  </div>
  );
}

export default App;
