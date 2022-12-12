import styles from '../styles/Home.module.css'
import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import axios from 'axios'
import {log} from "util";
type props = {
  predictedValue: Function
}

type ob = {
  name:string
}

export default function UploadImage({predictedValue}:props){
  const [isLoading, setIsLoading] = useState(false)
  const [img, setImg] = useState<string>('/img/default_img.svg')
  const [text, setText] = useState('Suba una imagen aquí')

  useEffect(() => {
    if(isLoading) {
      setText('loading...')
      setImg('https://media.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif')
    }
  }, [isLoading])

  const uploadImage = async (arg:any) => {
    setIsLoading(true)
    const file : string = await toBase64(arg.target.files[0])
    const formData =new FormData();
    formData.append('file', arg.target.files[0])

    await axios.put('https://ic.criiscz.live:8000/api/predict/file', formData)
      .then(res => {
        predictedValue(res.data)
      })
    await setImg(file);
    // await fetch('http://localhost:8000/api/predict/file',
    //   {
    //     method:'PUT',
    //     body: formData
    //   }
    // ).then(
    //   res => res.json()
    // ).then((res) => predictedValue(res))

    await setIsLoading(false)
    setText('')
  }

  const toBase64 = (file:any) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

    return(
        <div className={styles.box}>
          <Image src={img} alt="image" width={text===''?200:100} height={text===''?200:100}/>
          <p id={"text-img"} className={styles.textWeak}>{text}</p>

          <label htmlFor="file-upload" className={styles.custom_file_upload}>
            Subir Imágen
          </label>
          <input className={styles.file_upload} id="file-upload" type="file" onChange={uploadImage}/>
        </div>
    )
}