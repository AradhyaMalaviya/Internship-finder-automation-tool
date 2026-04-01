import express from 'express'

import fs from 'fs'
import csv from 'csv-parser'
import { pipeline } from 'stream'
import nodemailer from 'nodemailer'

const app = express();
const port = 8000;
app.use(express.json());

const array = []

const stream =  fs.createReadStream('./recruiters.csv')
.pipe(csv())
stream.on("data", (data) => array.push(data))
stream.on("end", ()=>console.log(stream))


const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : '',
        pass : ''
    }
})

for(let row of array){
    try{

        await transporter.sendMail({
            from : '',
            to : row.Email,
            subject : `Internship at ${row.Company}`,
            html: `
              <p>Hi ${row.Name},</p>
              <p>I am interested in opportunities at ${row.Company}.</p>
              <p>Resume attached.</p>
               `,
           attachments: [
           {
            filename: "rohit_resume.pdf",
             path: "./rohit_resume.pdf"
           }
           ]
        })

        console.log(`email sent to  ${row.Email}`)
        await new Promise(r => setTimeout(r,60000))
    }catch(err){
        console.log(err)
    }
}


app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})