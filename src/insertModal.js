import './App.css';
import { Modal } from 'flowbite';
import React, { useState, useEffect,useRef } from 'react';
import { getFirestore, collection, addDoc,getDocs } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage,ref, uploadBytes,listAll,getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
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

const InsertModal = ({ openModalInsert, setOpenModalInsert,noti })  => {
    const [Name, setName] = useState('');
    const [Detail, setDetail] = useState('');
    const [Address, setAddress] = useState('');
    const [Date, setDate] = useState([{ start: '00:00', end: '00:00' }]);
    const [Time, setTime] = useState('');
    const [Tel, setTel] = useState('');
    const [Type, setType] = useState('');
    const [Fee, setFee] = useState('');
    const [Lat, setLat] = useState('');
    const [Long, setLong] = useState('');
    const [fetchedData, setFetchedData] = useState([]);
    const nameRef = useRef(null);
    const detailRef = useRef(null);
    const addressRef = useRef(null);
    const dateRef = useRef(null);
    const typeRef = useRef(null);
    const [ImgUpload,setImgUpload] = useState()
    const [ImgList,setImgList] = useState([])
    const ImgListRef = ref(storage,"images/")
    const [alertMessage, setAlertMessage] = useState('');

const uploadImg = async (images) => {
      const imgURLs = [];
      for (const img of images) {
        const ImgRef = ref(storage, `images/${img.name}`);
        await uploadBytes(ImgRef, img);
        const ImgURL = await getDownloadURL(ImgRef);
        imgURLs.push(ImgURL);
      }
      return imgURLs;
    };
    

   useEffect(()=>{
    listAll(ImgListRef).then((response)=>{
      response.items.forEach((item)=>{
        getDownloadURL(item).then((url)=>{
          setImgList((prev)=>[...prev,url]);
        });
      });
    });
   },[]);
  
   
   async function create() {
    try {
        const imgUrls = await uploadImg(ImgUpload); // ส่งรูปภาพไปยังฟังก์ชัน uploadImg()
        const museumAppCollection = collection(db, 'MuseumApp');
        await addDoc(museumAppCollection, {
            Name: Name,
            Detail: Detail,
            Address: Address,
            Date: Date,
            Type: Type,
            ImageUrls: imgUrls, // บันทึก URL ของรูปภาพในรูปแบบของอาร์เรย์
            Tel: Tel,
            Time: Time,
            Fee: Fee,
            Lat: Lat,
            Long: Long,
        });

        // ล้างค่าตัวแปรที่ใช้สำหรับข้อมูลฟอร์มหลังจากบันทึก
        setName('');
        setDetail('');
        setAddress('');
        setDate('');
        setType('');
        setTel('');
        setTime('');
        setFee('');

        // ล้างค่าในฟอร์มหลังจากบันทึก
        nameRef.current.value = '';
        detailRef.current.value = '';
        addressRef.current.value = '';
        dateRef.current.value = '';
        typeRef.current.value = '';

        alert('Document created successfully!');
    } catch (error) {
        console.error('Error adding document: ', error);
    }
}

  
  const notify = () => toast("Wow so easy!");

  const handleTimeChange = (index, value) => {
    if (index === 0 || index === 1) {
      const newTimes = [...Date];
      newTimes[index] = value;
      setDate(newTimes);
    } else {
      console.error('Invalid index');
    }
  }
  
  

  const addTimeRange = () => {
    setDate([...Date, { start: '00:00', end: '00:00' }]);
  };
  return (
    <div >
    {alertMessage && (
        <div>
          {alertMessage}
          <button onClick={() => setAlertMessage('')}>Close</button>
        </div>
      )}
      <div className={`bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40 ${openModalInsert ? 'block' : 'hidden'}`}  >
<div
        id="FoodModal"
        tabIndex="-1"
        aria-hidden="true"
        className={`fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full justify-center items-center flex ${openModalInsert ? 'block' : 'hidden'} `}>
        <div className="relativel max-w-lg max-h-full"  style={{ width: '25%'}}>
        
        <div className="relative bg-white rounded-lg shadow ">
        <div className="flex items-start justify-between p-4 border-b rounded-t ">
                <h3 className="text-xl font-normal text-gray-900 dark:text-white">
                    เพิ่มข้อมูลอาหาร
                </h3>
                
                <button
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
          onClick={() => {
            setOpenModalInsert(false); // Set openModal to false to close the modal
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

                <form className="space-y-6 " action="#">
                    <div>
                        <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่อพิพิธภัณฑ์</label>
                        <input type="text" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " 
                        required
                        ref={detailRef}
                        onChange={(event) => {
                          setName(event.target.value)
                        }}
                        />
                    </div>
                    <div>
                    <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">รูปภาพพิพิธภัณฑ์</label>
                    <input type="file" 
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50" 
                        onChange={(event) => {setImgUpload(event.target.files)}} // ปรับเปลี่ยน setImgUpload ตามตัวแปรที่ใช้
                        multiple // เพิ่ม attribute multiple เพื่อให้สามารถเลือกรูปหลายรูปได้
                    />
                    {ImgUpload && 
                        Array.from(ImgUpload).map((image, index) => (
                            <img key={index} src={URL.createObjectURL(image)} alt={`museum_${index}`} className="mt-4 rounded-lg" style={{ width: "100%", height: 300 }} />
                        ))
                    }
                </div>

                    <div>
                        <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">รายละเอียดพิพิธภัณฑ์</label>
                        <textarea type="text" 
                        className="block w-full h-[10rem] text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 " 
                        required
                        ref={detailRef}
                        onChange={(event) => {
                          setDetail(event.target.value)
                        }}
                        >
                      </textarea>
                    </div>
                    <div>
                        <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ที่อยู่พิพิธภัณฑ์</label>
                        <input type="text" 
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 " 
                        required
                        ref={detailRef}
                        onChange={(event) => {
                          setAddress(event.target.value)
                        }}
                        />
                    </div>
                    <div>
                        <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ช่วงเวลาทำการ </label>
                        <input type="text" 
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 " 
                        required
                        ref={detailRef}
                        onChange={(event) => {
                          setDate(event.target.value)
                        }}
                        />
                    </div>
                    <div>
                        <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ช่วงเวลาแนะนำ</label>
                        <input type="text"   
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " 
                        required
                        ref={dateRef}
                        onChange={(event) => {
                          setTime(event.target.value)
                        }}
                        />
                    </div>
                    {/* <div>
                    <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="start-time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Start time:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd"/>
                </svg>
              </div>
              <input
              type="time"
              id="start-time"
              className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              min="09:00"
              max="18:00"
              defaultValue="00:00"
              required
              ref={detailRef}
              onChange={(e) => handleTimeChange(0, e.target.value)}
            />
            </div>
          </div>

          <div className="flex-1">
            <label htmlFor="end-time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              End time:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd"/>
                </svg>
              </div>
              <input
              type="time"
              id="end-time"
              className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              min="09:00"
              max="18:00"
              defaultValue="00:00"
              required
              ref={detailRef}
              onChange={(e) => handleTimeChange(1, e.target.value)}
            />
            </div>
          </div>


            </div>
            </div> */}
                    <div>
                        <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">โทรศัพท์</label>
                        <input type="text"   
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " 
                        required
                        ref={dateRef}
                        onChange={(event) => {
                          setTel(event.target.value)
                        }}
                        />
                    </div>

                    <div>
                        <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ค่าเข้าชม</label>
                        <input type="text"   
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " 
                        required
                        ref={dateRef}
                        onChange={(event) => {
                          setFee(event.target.value)
                        }}
                        />
                    </div>
                    <div>
                        <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ละติจูด</label>
                        <input type="text"   
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " 
                        required
                        ref={dateRef}
                        onChange={(event) => {
                          setLat(event.target.value)
                        }}
                        />
                    </div>
                    <div>
                        <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ลองจิจูด</label>
                        <input type="text"   
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " 
                        required
                        ref={dateRef}
                        onChange={(event) => {
                          setLong(event.target.value)
                        }}
                        />
                    </div>
                    <div>
                    <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ประเภทพิพิธภัณฑ์</label>
                    <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    onChange={(event) => setType(event.target.value)}>
                    <option value="ศิลปะ">ศิลปะ</option>
                    <option value="ท้องถิ่น">ท้องถิ่น</option>
                    <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                  </select>
                    </div>
                    <div class="flex justify-end space-x-4">
                        <div>
                     <button type="submit" name="submit" class="h-12 px-6 text-white bg-gradient-to-r from-red-400 via-Neutral-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-normal rounded-lg text-sm py-2.5 text-center" onClick={() => {
            setOpenModalInsert(false); // Set openModal to false to close the modal
                }}>Close</button>
                    </div> 
                    <div>
                    <button type="submit" name="submit" class=" h-12 px-6 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-normal rounded-lg text-sm py-2.5 text-center" 
                    onClick={() => {
                      setOpenModalInsert(false); 
                      noti();
                      uploadImg(ImgUpload).then(() => {
                          create();
                          // addTimeRange();
                      });
                  }}>Submit</button>
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

export default InsertModal;
