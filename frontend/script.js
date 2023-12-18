// script.js

async function submitForm() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
      const response = await fetch("http://localhost:8080/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      // Handle the response data accordingly
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  