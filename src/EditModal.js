import './App.css';
import { Modal } from 'flowbite';
import React, { useState, useEffect,useRef } from 'react';
import { getFirestore, collection, addDoc,getDocs,updateDoc,doc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage,ref, uploadBytes,listAll,getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import App from './App';
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

const EditModal = ({ openModal, setOpenModal, editData,noti})  => {
    const [updatedName, setUpdatedName] = useState(editData.Name);
    const [updatedDetail, setUpdatedDetail] = useState(editData.Detail);
    const [updatedAddress, setUpdatedAddress] = useState(editData.Address);
    const [updatedDate, setUpdatedDate] = useState(editData.Date);
    const [updatedType, setUpdatedType] = useState(editData.Type);
    const [updatedImg, setUpdatedImg] = useState();
    const [ImgPreView, setImgPreView] = useState(editData.ImageUrl);
    const [updatedLat, setUpdatedLat] = useState(editData.Lat);
    const [updatedLong, setUpdatedLong] = useState(editData.Long);
    const [notify,setNotify] = useState();

    async function updateData(documentId, newData) {
        const museumAppDocRef = doc(db, 'MuseumApp', documentId);
        await updateDoc(museumAppDocRef, newData);

      }
  
      const handleFormSubmit = async (e) => {
        const imgUrl = await uploadImg();
        let newData = null; // เริ่มต้นด้วยการกำหนด newData เป็น null
    
        if(updatedImg == null) {
            newData = {
                Name: updatedName,
                Detail: updatedDetail,
                Address: updatedAddress,
                Date: updatedDate,
                Type: updatedType,
                Lat: updatedLat,
                Long: updatedLong
            };
        } else {
            newData = {
                Name: updatedName,
                Detail: updatedDetail,
                Address: updatedAddress,
                Date: updatedDate,
                Type: updatedType,
                ImageUrl : imgUrl,
                Lat: updatedLat,
                Long: updatedLong
            };
        }
        await updateData(editData.id, newData);
    };
    

      const uploadImg = async () => {
        if (updatedImg == null) 
        return updatedImg;
        const ImgRef = ref(storage, `images/${updatedImg.name}`);
        await uploadBytes(ImgRef, updatedImg);
        const ImgURL = getDownloadURL(ImgRef);
        return ImgURL;
      };
      
  return (
    <div >
      <div className={`bg-gray-900 bg-opacity-50 fixed inset-0 z-40 ${openModal ? 'block' : 'hidden'}`}>
<div
        id="EditModal"
        tabIndex="-1"
        aria-hidden="true"
        className={`fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full justify-center items-center flex ${openModal ? 'block' : 'hidden'}`}
      >
            <div className="relativel max-w-full max-h-full"  style={{ width: '25%'}}>
        
        <div className="relative bg-white rounded-lg shadow ">
        <div className="flex items-start justify-between p-4 border-b rounded-t ">
                <h3 className="text-xl font-normal text-gray-900 dark:text-white">
                    แก้ไขข้อมูล
                </h3>
                
                <button
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
          onClick={() => {
            setOpenModal(false); 
          }}
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
            </div>
            <div className="px-6 py-6 lg:px-8">

                <form className="space-y-6" action="#" onSubmit={handleFormSubmit}>
                <div>
      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        ชื่อพิพิธภัณฑ์
      </label>
      <input
        type="text"
        defaultValue={editData.Name}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        onChange={(event) => {
            setUpdatedName(event.target.value)
          }}
      />
    </div>
                <div>
                  <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    รูปภาพพิพิธภัณฑ์
                  </label>
                  <input
                    type="file"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                    onChange={(event) => {setUpdatedImg(event.target.files[0])
                      setImgPreView(URL.createObjectURL(event.target.files[0]))}
                  }
                  />
                    {ImgPreView && <img src={ImgPreView} alt="museum" className="mt-4 rounded-lg" style={{ width: "100%", height:300}} />}
                </div>

                    <div>
                        <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">รายละเอียดพิพิธภัณฑ์</label>
                        <input type="text"   
                        defaultValue={editData.Detail}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " 
                        onChange={(event) => {
                            setUpdatedDetail(event.target.value)
                          }}/>
                    </div>
                    <div>
                        <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ที่อยู่พิพิธภัณฑ์</label>
                        <input type="text"
                        defaultValue={editData.Address}
                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " 
                         onChange={(event) => {
                          setUpdatedAddress(event.target.value)
                        }}
                         />
                    </div>
                    <div>
                        <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เวลาทำการ</label>
                        <input type="text"
                        defaultValue={editData.Date}
                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                         onChange={(event) => {
                          setUpdatedDate(event.target.value)
                        }}
                          />
                    </div>
                    <div>
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ประเภทพิพิธภัณฑ์</label>
                    <select  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       onChange={(event)=>{
                       setUpdatedType(event.target.value)
                    }}
                    >
                      <option>ศิลปะ</option>
                      <option>ท้องถิ่น</option>
                      <option>วิทยาศาสตร์</option>
                    </select>
                    </div>
                    <div>
                        <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ละติจูด</label>
                        <input type="text"
                        defaultValue={editData.Lat}
                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " 
                         onChange={(event) => {
                          setUpdatedLat(event.target.value)
                        }}
                         />
                    </div>
                    <div>
                        <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ลองจิจูด</label>
                        <input type="text"
                        defaultValue={editData.Long}
                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " 
                         onChange={(event) => {
                          setUpdatedLong(event.target.value)
                        }}
                         />
                    </div>
                    <div class="flex justify-end space-x-4">
                        <div>
                     <button type="submit" name="submit" class="px-10 text-red-600 inline-flex justify-center items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900" 
                     style={{width:"40px",height:"50px"}}
                     onClick={() => {
                    setOpenModal(false); 
                    }}>
                  ปิด
                  </button>
                    </div> 
                    <div>
                    <button type="submit" name="submit" class=" h-12 px-6 text-white bg-green-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-normal rounded-lg text-sm  text-center" 
                    style={{height:"50px"}}
                    onClick={() => {
                      handleFormSubmit();
                      setOpenModal(false);
                      noti()
                    }}
                     >บันทึก</button>
                    </div>   
                </div>
                </form>
            </div>
        </div>
    </div>
</div> 
        </div>
  </div>
  );
}

export default EditModal;