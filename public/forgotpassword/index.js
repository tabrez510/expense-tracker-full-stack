const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const userDetails = {
        email: form.get('email')
    }

    try{
        const response =await axios.post('http://http://3.25.214.158/:3000/api/password/forgotpassword', userDetails);
        if(response.status == 202){
            alert('password changed');
        }
    } catch(err) {
        console.log(err);
        alert(err.message);
    }
})