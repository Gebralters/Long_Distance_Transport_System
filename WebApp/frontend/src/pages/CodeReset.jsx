import React from "react";

const CodeReset =()=>
{
    return(
       <div className="body">
            <div className="wrapper1">
            <div className="form-wrapper sign-in">
                <form action>
                <h2>Send Code</h2>
                <div className="input-group">
                    <input type="text" required />
                    <label htmlFor>Email:</label>
                </div>
                <button type="submit" id="btn">Send Code</button>
                </form>
            </div>
            </div>  
       </div>
    )
}

export default CodeReset;