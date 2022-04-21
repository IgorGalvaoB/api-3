const authReq =async ({ body }) => {

    const payload = {
  
      username: body.username,
  
      email: body.email,
  
      password: body.password
      
    }
  
    return payload
  
  }
  
  module.exports = authReq