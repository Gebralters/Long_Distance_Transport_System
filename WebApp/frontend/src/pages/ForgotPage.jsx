import React from "react";

const ForgotPage =()=>
{
    return(
      <div className="body">
        

        <div className="wrapper2">
        <div className="form-wrapper sign-in">
            <form action>
            <h2>Reset Password</h2>
            <div className="input-group">
                <input type="password" required />
                <label htmlFor>Code:</label>
            </div>
            <div className="input-group">
                <input type="password" required />
                <label htmlFor>New Password:</label>
            </div>
            <div className="input-group">
                <input type="password" required />
                <label htmlFor>Confirm Password:</label>
            </div>
            <button type="submit" id="btn">Reset</button>
            </form>
        </div>
        </div>

        
      </div>
    )
}

export default ForgotPage;