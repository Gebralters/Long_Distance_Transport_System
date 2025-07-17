import React, { useEffect, useState } from 'react';
import Authjs from '../components/Authjs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GlobalVariables from '../Javascript/GlobalVariables';

function AuthPage ()
{  
    //global variable for storing the user id after login
    const [userId, setUserId] = useState(GlobalVariables.userId);

    const [data, setData] = useState(null);
    const [Logemail, setLogemail]= useState(null);
    const [Logpass, setLogpass]= useState(null);
    

    const [regfname, setregfname]= useState(null);
    const [regsurname, setregsurname]= useState(null);
    const [regemail, setregemail]= useState(null);
    const [regcontact, setregcontact]= useState(null);
    const [regititle, setregtitle]= useState(null);
    const [regpass, setregpass]= useState(null);
    const [regconpass, setregconpass]= useState(null);
    const [regusertype, setregusertype]= useState(1);
    const [regdatetime, setregdatetime] = useState(null);
   

    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);

    const [passSame, setpassSame] = useState(true);
    const [userexist, setexistuser] = useState('false');
    const [regok, setregok] = useState(true);


    const navigate= useNavigate();

    function handlelogsubmit(event)
    {
        
        event.preventDefault();
        axios.post('http://localhost:8081/loguser', {Logemail,Logpass})
        .then(res=>{ 
        
          const {data} =res;

          const user=data[0];

          console.log('Server response data:', data);
          if(data.length>0)
          {
            console.log(user.U_USERTYPE);
            if(user.U_EMAIL===Logemail && user.U_PASSWORD===Logpass)
                {
                    console.log('Ouptput userid');
                    console.log(user.U_USERTYPE);
                    if(user.U_USERTYPE===3)
                    {
                        GlobalVariables.userId = user.U_ID; // This could come from an API call or other logic
                        setUserId(GlobalVariables.userId);
                        navigate(`/HomePage`);
                    }
                    else if(user.U_USERTYPE===1)
                    {
                        GlobalVariables.userId = user.U_ID; // This could come from an API call or other logic
                        setUserId(GlobalVariables.userId);
                        navigate(`/Driver`);
                    }
                }
                else
                {
                    console.log("unsuccess both");
                       setEmailValid(false);
                       setPasswordValid(false);
                }
          }
          else
          {
            setEmailValid(false);
            setPasswordValid(false);

          }
          
        }).catch(err=>console.log(err));
        
    }
    function handleregsubmit(event)
    {
        
        event.preventDefault();
        
        if(regconpass!==regpass)
        {
            setpassSame(false);
            
        }
        else{
           
           
            axios.post('http://localhost:8081/checkuser', {regemail,regpass})
            .then(
                res=>{
                
                    const {data} =res;
                    console.log('Server response data:', data);
                    if(data.exists==='true')
                    {
                        setexistuser('true');
                        setpassSame(false);
                        setregok(true);
                        window.alert("User Already Exists!!!!!");
                        
                    }
                    else
                    {
                        setexistuser('false');
                    }
                   
                }
            )
            .catch(err=>console.log(err));

            console.log('proove');
            console.log(userexist);
            
            if(userexist==='false')
            {
                axios.put('http://localhost:8081/reguser', {regfname,regsurname,regemail,regcontact,regititle,regpass,regusertype})
                .then(
                res=>{
                    const {data} =res;
                    console.log('Server response data:', data);
                    if(data.message==="Success")
                    {
                        setregok(false);
                        setpassSame(true);
                        window.alert('Success');
                    }
                    else{
                        setpassSame(false);
                        setregok(true);
                    }
                    }
                )
                .catch(err=>console.log(err));
            }
           
            
            
        }

        
    }
    
    return(
      <div className="body">
            <div className="wrapper">
            <div className="form-wrapper sign-up">
                <form action=''>
                <h2>Sign Up</h2>
                
                <div className="input-group" >
                    <input type="text"
                    style={{
                        borderColor: regok ? 'initial' : 'green',
                    }}
                    onChange={e=>setregfname(e.target.value)}
                    required />
                    <label htmlFor>First Name:</label>
                </div>
                
                <div className="input-group">
                    <input type="text" required 
                    style={{
                        borderColor: regok ? 'initial' : 'green',
                    }}
                    onChange={e=>setregsurname(e.target.value)}/>
                    <label htmlFor>Surname:</label>
                </div>
                <div className="input-group">
                    <input type="email" required 
                    style={{
                        borderColor: regok ? 'initial' : 'green',
                    }}
                    onChange={e=>setregemail(e.target.value)}/>
                    <label htmlFor>Email:</label>
                </div>
                <div className="input-group">
                    <input type="text" required 
                    style={{
                        borderColor: regok ? 'initial' : 'green',
                    }}
                    onChange={e=>setregcontact(e.target.value)}/>
                    <label htmlFor>Contact Number:</label>
                </div>
                <div className="input-group">
                    <input type="text" required 
                    style={{
                        borderColor: regok ? 'initial' : 'green',
                    }}
                    onChange={e=>setregtitle(e.target.value)}/>
                    <label htmlFor>Title:</label>
                </div>
                <div className="input-group">
                    <input type="password" required
                    style={{
                        borderColor: passSame ? 'initial' : 'red',
                        
                    }}
                    
                    onChange={e=>setregpass(e.target.value)} />
                    <label htmlFor>Password:</label>
                </div>
                <div className="input-group">
                    <input type="password" required
                    style={{
                        borderColor: passSame ? 'initial' : 'red',
                       
                    }}
                     onChange={e=>setregconpass(e.target.value)}/>
                    <label htmlFor>Confirm Password:</label>
                </div>
                <button onClick={handleregsubmit} id="btn" 
                style={{
                   
                   backgroundColor: regok ? '#1F6CC2' : '#1F6CC2',
                }}
                >Sign Up</button>
                <div className="sign-link">
                    <p>Don't have an account? <a href="#" className="signIn-link">Login</a></p>
                </div>
                </form>
            </div>
            <div className="form-wrapper sign-in">
                <form action=''>
                <h2>Login</h2>
                <div className="input-group">
                    <input type="text" 
                    onChange={e=>setLogemail(e.target.value)}
                    style={{
                        borderColor: passwordValid ? 'initial' : 'red',
                    }}
                    required />
                    <label htmlFor>Email</label>
                </div>
                <div className="input-group">
                    <input type="password" required 
                    onChange={e=>setLogpass(e.target.value)}
                    style={{
                        borderColor: passwordValid ? 'initial' : 'red',
                    }}
                    />
                    <label htmlFor>Password</label>
                </div>
                <div className="forgot-pass">
                    <a href="CodeReset.html">Forgot Password?</a>
                </div>
                <button onClick={handlelogsubmit} type="submit" id="btnlog" className="log-btn">Login</button>
                <div className="sign-link">
                    <p>Don't have an account? <a href="#" className="signUp-link">Sign Up</a></p>
                </div>
                </form>
            </div>
            </div>

            <Authjs/>   
      </div>
    )
}

export default AuthPage;