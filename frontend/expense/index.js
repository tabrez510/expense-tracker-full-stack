const baseURL = 'http://localhost:3000/api';

function validate () {
    const amount = document.getElementById('amount').value;
    const discription = document.getElementById('discription').value;
    const catagory = document.getElementById('catagory').value;

    if(!amount && amount !== 0){
        alert('Enter Your Amount');
        return false;
    }
    if(!discription){
        alert('Enter Your Discription');
        return false;
    }
    if(catagory == 'Choose Catagory'){
        alert('Choose Your Catagory');
        return false;
    }
    return true;
}

function formatCreatedAt(createdAtString) {
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'Asia/Kolkata',
      hour12: false,
    };

    const formattedCreatedAt = new Intl.DateTimeFormat('en-US', options).format(new Date(createdAtString));

    return formattedCreatedAt;
}
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


async function showLeader() {
    const token = localStorage.getItem('token');
    try {
        const getUserLeaderboard = await axios.get(`${baseURL}/premium/show-leaderboard`, {headers: {"Authorization": token}});

        const tbody = document.querySelectorAll('tbody');
        tbody[0].innerHTML = '';
        getUserLeaderboard.data.forEach((element, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index+1}</td>
                <td>${element.name}</td>
                <td>${element.total_expense}</td>
            `;
            tbody[0].appendChild(tr);
        });

        const height = document.querySelector('.table-leader').style.height;

        if(height === '0vh' || height === ''){
            document.querySelector('.table-leader').style.height = '80vh';
            document.getElementById('leaderboard').innerText = 'Hide Leaderboard';
        }
        else {
            document.querySelector('.table-leader').style.height = '0vh';
            document.getElementById('leaderboard').innerText = 'Show Leaderboard';
        }
    } catch(err) {
        console.log(err);
        alert(err.message);
    }
}

window.addEventListener('DOMContentLoaded', async() => {

    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    document.querySelector('span').textContent = decodedToken.name;
    if(decodedToken.isPremiumUser){
        document.querySelector('.btn-leader').style.display = 'block';
        document.querySelector('.table-leader').style.display = 'block';
        document.querySelector('sup').style.display = 'inline-block';
        document.querySelector('.btn-premium').style.display = 'none';
        document.getElementById('leaderboard').onclick = showLeader;
    } else {
        document.querySelector('sup').style.display = 'none';
        document.querySelector('.btn-premium').style.display = 'block';
    }

    try{
        const expenses = await axios.get(`${baseURL}/user/expenses`, {headers: {"Authorization": token}}); 
        for(let i=0; i<expenses.data.length; i++){
            showExpense(expenses.data[i]);
        }
    } catch(err) {
        console.log(err);
        if(err.response.status == 401){
            window.location.href = '../login/index.html';
            alert('Login again');
        }
    }
});

const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
    if(validate()){
        event.preventDefault();

        const amount = event.target.amount.value;
        const discription = event.target.discription.value;
        const catagory = event.target.catagory.value;

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${baseURL}/user/expenses`, {amount, discription, catagory}, {headers: {"Authorization": token}});
            showExpense(res.data);
        } catch(err) {
            console.log(err);
            alert(err.message);
        }
    }
});

function showExpense(expense){
    const tbody = document.querySelectorAll('tbody');
    const formattedCreatedAt = formatCreatedAt(expense.createdAt);

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${expense.amount}</td>
        <td>${expense.discription}</td>
        <td>${expense.catagory}</td>
        <td>${formattedCreatedAt}</td>
        <td>
            <button class="edit" onclick="editExpense(${expense.id}, this)">Edit</button>
            <button class="delete" onclick="deleteExpense(${expense.id}, this)">Delete</button>
        </td>
    `;


    tbody[1].insertBefore(tr, tbody.firstChild);

    document.getElementById('amount').value = '';
    document.getElementById('discription').value = '';
    document.getElementById('catagory').value = 'Choose Catagory';
}

function editExpense (id, event) {
    const catagory = event.parentElement.previousElementSibling.previousElementSibling.textContent;
    const discription = event.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    const amount = event.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

    
    
    // populate these values in the input fields
    document.getElementById('amount').value = amount;
    document.getElementById('discription').value = discription;
    document.getElementById('catagory').value = catagory;

    document.getElementById('addBtn').style.display = 'none';
    document.getElementById('editBtn').style.display = 'inline-block';

    const editBtn = document.getElementById('editBtn');

    editBtn.addEventListener('click', async() => {
        const inputAmount = document.getElementById('amount').value;
        const inputDiscription = document.getElementById('discription').value;
        const inputCatagory = document.getElementById('catagory').value;

        const obj = {
            amount : inputAmount,
            discription : inputDiscription,
            catagory : inputCatagory
        }
        try {
            // update in the dom through event object
            event.parentElement.previousElementSibling.previousElementSibling.textContent = inputCatagory;
            event.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent = inputDiscription;
            event.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent = inputAmount;

            document.getElementById('amount').value = '';
            document.getElementById('discription').value = '';
            document.getElementById('catagory').value = 'Choose Catagory';

            document.getElementById('editBtn').style.display = 'none';
            document.getElementById('addBtn').style.display = 'inline-block';
    
            // update in database
            const token = localStorage.getItem('token');
            await axios.put(`${baseURL}/user/expenses/${id}`, obj, {headers: {"Authorization": token}});

        } catch (err) {
            console.log(err);
            alert(err.message);
        }

    })
}

async function deleteExpense (id, event) {
    try {
        const tbody = document.querySelectorAll('tbody');
        const tr = event.parentElement.parentElement;
        tbody[1].removeChild(tr);
        const token = localStorage.getItem('token');
        await axios.delete(`${baseURL}/user/expenses/${id}`, {headers: {"Authorization": token}});
    } catch (err) {
        console.log(err);
        alert(err.message);
    }
}

document.getElementById('rzp-button1').addEventListener('click', async(e) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/user/premiummembership`, {headers: {"Authorization": token}});
        console.log(response);

        var options = {
            "key": response.data.key_id,
            "order_id": response.data.order.id,

            "handler": async function (response) {
                try {
                    const userDetails = await axios.post(`${baseURL}/user/updatetransactionstatus`,{
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id,
                    }, {headers: {"Authorization": token}});
        
                    
                    // show the premium badge
                    document.querySelector('sup').style.display = 'inline-block';
                    document.querySelector('.btn-premium').style.display = 'none';
                    localStorage.setItem('token', userDetails.data.token);
        
                    document.querySelector('.btn-leader').style.display = 'block';
                    document.querySelector('.table-leader').style.display = 'block';

                    document.querySelector('.btn-leader').onclick = showLeader;
                } catch(err) {
                    console.error(err);
                    alert('Failed to update transaction status.');
                }
            }
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();

        rzp1.on('payment.failed', function (response) {
            console.log(response);
            alert('Something went wrong');
        });
    } catch(err) {
        console.log(err);
        alert('Something went wrong. Please try again.');
    }
});