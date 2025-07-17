import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Faqmain() {
    const [data, setData] = useState([]);

    const [catGroup, setCatGroup] = useState('');
    const [questionGroup, setQuestionGroup] = useState('');
    const [answerGroup, setAnswerGroup] = useState('');
    const [deleteid, setdeleteid] = useState('');
    const [catid, setCatid] = useState('');
    
    function hidefaqinputs(e) {
        e.preventDefault(); 
        const selectedOption = document.getElementById('myOption').value;
       //
        
        const questionGroup = document.getElementById('faqquestion-div');
        const answerGroup = document.getElementById('faqanser-div');
        
        const catGrouph = document.getElementById('mycatOption');
        const IdGroup = document.getElementById('faqid-div');

        if (selectedOption === "Question") {
            questionGroup.style.display = "block";
            answerGroup.style.display = "none";
            catGrouph.style.display = "none";
            IdGroup.style.display = "block";
        } else if (selectedOption === "Answer") {
            questionGroup.style.display = "none";
            answerGroup.style.display = "block";
            catGrouph.style.display = "none";
            IdGroup.style.display = "block";
        } else if (selectedOption === "Add") {
            questionGroup.style.display = "block";
            answerGroup.style.display = "block";
            catGrouph.style.display = "block";
            IdGroup.style.display = "none";
        } 
        else if (selectedOption === "Both") {
            questionGroup.style.display = "block";
            answerGroup.style.display = "block";
            IdGroup.style.display = "block";
            catGrouph.style.display = "none";
        
        } 
        else if (selectedOption === "Delete") {
            questionGroup.style.display = "none";
            answerGroup.style.display = "none";
            IdGroup.style.display = "block";
            catGrouph.style.display = "none";
        } 
    }

   
    

   function handledelete(e){
    e.preventDefault(); 
      const selectedOption = document.getElementById('myOption').value;
      
      

      if(selectedOption==="Delete")
      {
        
         axios.delete('http://localhost:8081/deletefaq', {
            data: { delstatus: deleteid }
        })
        .then(res=>{
            const {data} =res;
          
            if(data.status==='Deleted')
            {
               
                axios.get('http://localhost:8081/getfaq')
                .then(res => {
                    const {data} =res;
                  
                    setData(data);
                })
                .catch(err => console.log(err));
            }
            else{
              
            }
        })
        .catch(err=>console.log(err));


      }

   }
    function handleAdd (e){
        e.preventDefault(); 
        const selectedOption = document.getElementById('myOption').value;
        if(selectedOption==='Add')
        {
           
            axios.post('http://localhost:8081/addfaq',{questionGroup,answerGroup,catGroup} )
            .then(res=>{
                const {data} =res;
               
                if(data.status==='Added')
                {
                   
                    axios.get('http://localhost:8081/getfaq')
                    .then(res => {
                        const {data} =res;
                       
                        setData(data);
                    })
                    .catch(err => console.log(err));
                }
                else{
                   
                }
            })
            .catch(err=>console.log(err));
        }
        

        
   }
   function handleedit(e)
   {
    e.preventDefault(); 
    const selectedOption = document.getElementById('myOption').value;
        if(selectedOption==='Question')
        {
            axios.put('http://localhost:8081/updateques',{questionGroup,deleteid} )
            .then(res=>{
                const {data} =res;
               
                if(data.status==='Updated')
                {
                  
                    axios.get('http://localhost:8081/getfaq')
                    .then(res => {
                        const {data} =res;
                       
                        setData(data);
                    })
                    .catch(err => console.log(err));
                }
                else{
                    console.log('Failed');
                }
            })
            .catch(err=>console.log(err));
        }
        else if(selectedOption==='Answer')
        {
            axios.put('http://localhost:8081/updateans',{answerGroup,deleteid} )
            .then(res=>{
                const {data} =res;
                if(data.status==='Updated')
                {
                   
                    axios.get('http://localhost:8081/getfaq')
                    .then(res => {
                        const {data} =res;
                        setData(data);
                    })
                    .catch(err => console.log(err));
                }
                else{
                    console.log('Failed');
                }
            })
            .catch(err=>console.log(err));
        }
        else if(selectedOption==='Both')
        {
            axios.put('http://localhost:8081/updateboth',{questionGroup,answerGroup,deleteid} )
            .then(res=>{
                const {data} =res;
                if(data.status==='Updated')
                {
                    axios.get('http://localhost:8081/getfaq')
                    .then(res => {
                        const {data} =res;
                        setData(data);
                    })
                    .catch(err => console.log(err));
                }
                else{
                    console.log('Failed');
                }
            })
            .catch(err=>console.log(err));
        }
   }
   useEffect(() => {
    axios.get('http://localhost:8081/getfaq')
        .then(res => {
            const {data} =res;
            setData(data);
        })
        .catch(err => console.log(err));
        

  }, []);
 
 
  return (
    <div>
       <div className="head-title">
                    <div className="left">
                        <h1>FAQ Management</h1>
                        <ul className="breadcrumb">
                        <li>
                            <a href="#">Dashboard</a>
                        </li>
                        <li><i className="bx bx-chevron-right" /></li>
                        <li>
                            <a className="active" href="#">Manage FAQ</a>
                        </li>
                        </ul>
                    </div>
                    <a href="#" className="btn-download">
                        <i className="bx bxs-cloud-download" />
                        <span className="text">Refresh</span>
                    </a>
                    </div>
                    <div className="managefaq-container">
                    <div className="view-faq">
                        <table className="FAQ-table">
                        <thead>
                            <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>Question</th>
                            <th>Answer</th>
                            </tr>
                        </thead>
                        <tbody>
                          {data.map((faq,index)=>(
                            <tr key={index}>
                            <td>{faq.FAQ_ID}</td>
                            <td>Booking &amp; Payments</td>
                            <td>{faq.FAQ_QUESTION}</td>
                            <td>{faq.FAQ_ANSWER}</td>
                            </tr>))}
                            
                            
                        </tbody>
                        </table>
                    </div>
                    <div className="edit-faq">
                        <div className="faq-label">
                        <form >
                            <h2>Edit FAQuestions</h2>
                            <div className="input-group">
                            
                            <select  onChange={hidefaqinputs} name="myOption" id="myOption">
                                <option value="">Choose Question/Answer/Add/Delete</option>
                                <option value="Question">Question</option>
                                <option value="Answer">Answer</option>
                                <option value="Both">Both</option>
                                <option value="Add">Add</option>
                                <option value="Delete">Delete</option>
                               
                            </select>
                            </div>
                            <div Id="faqid-div" className="input-group">
                            <input type="text" Id="Idfaq" 
                            onChange={(e) => setdeleteid(e.target.value)} 
                            required />
                            <label>FAQ ID:</label>
                            </div>
                           
                            <div className="input-group">
                            
                            <select name="myOption" onChange={(e) => setCatGroup(e.target.value)}  id="mycatOption">
                                <option value="">Category</option>
                                <option value="Bookings & Payment">Bookings & Payments</option>
                                <option value="Luggage">Luggage</option>
                                <option value="Travel">Travel</option>
                                
                               
                            </select>
                            </div>
                            <div Id="faqquestion-div" className="input-group">
                            <input type="text" Id="quesfaq"
                            onChange={(e) => setQuestionGroup(e.target.value)} 
                             required />
                            <label>New Question:</label>
                            </div>
                            
                            <div Id="faqanser-div" className="input-group">
                            <input type="text" Id="ansfaq"
                            onChange={(e) => setAnswerGroup(e.target.value)} 
                             required />
                            <label htmlFor>New Answer:</label>
                            </div>
                            
                            
                           
                        </form>
                        </div>
                        <div className="faq-btn">
                        <button onClick={handledelete}>Delete</button>
                        <button onClick={handleedit}>Edit</button>
                        <button onClick={handleAdd}>Add</button>
                        </div>
                    </div>
                    </div>
    </div>
  )
}
export default Faqmain;