const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const userDetails = {
        email: form.get('email')
    }

    try{
        const response =await axios.post('http://localhost:3000/api/password/forgotpassword', userDetails);
        if(response.status === 200){
            document.getElementById('user-not-found').style.display = 'none';
            document.getElementById('email-successful').style.display = 'block';
            document.getElementById('email').value = '';
        }
    } catch(err) {
        if(err.request.status === 404){
            document.getElementById('user-not-found').style.display = 'block';
        } else {
            console.log(err);
            alert(err.message);
        }
    }
})