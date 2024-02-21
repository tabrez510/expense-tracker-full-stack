const baseURL = 'http://13.239.43.1520/api';

function validate () {
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    if(!amount && amount !== 0){
        alert('Enter Your Amount');
        return false;
    }
    if(!description){
        alert('Enter Your Description');
        return false;
    }
    if(category == 'Choose Category'){
        alert('Choose Your Category');
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


function renderPaginationButtons(totalPages, currentPage) {
    const paginationSection = document.querySelector('.pagination');

    paginationSection.innerHTML = '';

    if(currentPage > 1){
        paginationSection.innerHTML += `<button class="page-number" onclick="navigateToPage(${Math.max(currentPage - 1, 1)})">Previous</button>`;
    }
    const MAX_PAGES_DISPLAYED = 10;
    const halfMaxPages = Math.floor(MAX_PAGES_DISPLAYED / 2);
    let startPage = Math.max(currentPage - halfMaxPages, 1);
    let endPage = Math.min(startPage + MAX_PAGES_DISPLAYED - 1, totalPages);
    if (endPage - startPage < MAX_PAGES_DISPLAYED - 1) {
        startPage = Math.max(endPage - MAX_PAGES_DISPLAYED + 1, 1);
    }
    if(startPage > 2){
        paginationSection.innerHTML += `<button class="page-number" onclick="navigateToPage(${1})">${1}</button>`;
        paginationSection.innerHTML += `<span>...</span>`
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationSection.innerHTML += `<button class="page-number ${currentPage === i ? 'active' : ''}" onclick="navigateToPage(${i})">${i}</button>`;
    }

    if(endPage < totalPages - 1){
        paginationSection.innerHTML += `<span>...</span>`
        paginationSection.innerHTML += `<button class="page-number" onclick="navigateToPage(${totalPages})">${totalPages}</button>`;
    }

    if(currentPage < totalPages){
        paginationSection.innerHTML += `<button class="page-number" onclick="navigateToPage(${Math.min(currentPage + 1, totalPages)})">Next</button>`;
    }
}


async function navigateToPage(pageNumber) {
    try {
        const token = localStorage.getItem('token');
        const itemsPerPage = localStorage.getItem('items-per-page') || 5;
        const response = await axios.get(`${baseURL}/user/expenses?page=${pageNumber}&items_per_page=${itemsPerPage}`, {
            headers: { "Authorization": token }
        });

        showExpense(response.data.expenses);

        renderPaginationButtons(response.data.lastPage, pageNumber);
    } catch (err) {
        console.log(err);
        if (err.response.status === 401 || err.response.status === 404) {
            window.location.href = '../login/index.html';
            alert('Login again');
        }
    }
}

document.getElementById('items-per-page').addEventListener('change', async() => {
    try {
        const token = localStorage.getItem('token');
        const val = document.getElementById('items-per-page').value;
        localStorage.setItem('items-per-page', val);
        const expenses = await axios.get(`${baseURL}/user/expenses?page=1&items_per_page=${val}`, {headers: {"Authorization": token}});
        showExpense(expenses.data.expenses);
        renderPaginationButtons(expenses.data.lastPage, expenses.data.currentPage);
    } catch(err) {
        console.log(err);
        if(err.response.status == 401 || err.response.status == 404){
            window.location.href = '../login/index.html';
            alert('Login again');
        } 
    }
})

document.getElementById('logout').addEventListener('click', () => {
    if(localStorage.getItem('token')){
        localStorage.removeItem('token');
    }
    window.location.href = "../index.html";
})

window.addEventListener('DOMContentLoaded', async() => {
    
    try{
        if(!localStorage.getItem('token')){
            window.location.href = '../login/index.html';
            alert('Login again');
        }
        const token = localStorage.getItem('token');
        const decodedToken = parseJwt(token);
        document.querySelector('span').textContent = decodedToken.name;
        if(decodedToken.isPremiumUser){
            document.querySelector('.btn-leader').style.display = 'block';
            document.querySelector('.table-leader').style.display = 'block';
            document.querySelector('sup').style.display = 'inline-block';
            document.querySelector('.btn-premium').style.display = 'none';
            document.getElementById('leaderboard').onclick = showLeader;
            document.querySelector('.download-report').style.display = 'block';
        } else {
            document.querySelector('sup').style.display = 'none';
            document.querySelector('.btn-premium').style.display = 'block';
        }
        var items_per_page;
        if(localStorage.getItem('items-per-page')){
            items_per_page = localStorage.getItem('items-per-page');
        } else {
            items_per_page = '5';
        }
        const expenses = await axios.get(`${baseURL}/user/expenses?page=1&items_per_page=${items_per_page}`, {headers: {"Authorization": token}});
        showExpense(expenses.data.expenses);
        renderPaginationButtons(expenses.data.lastPage, expenses.data.currentPage);
    } catch(err) {
        console.log(err);
    }
});

const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
    if(validate()){
        event.preventDefault();

        const amount = event.target.amount.value;
        const description = event.target.description.value;
        const category = event.target.category.value;

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${baseURL}/user/expenses`, {amount, description, category}, {headers: {"Authorization": token}});
            var items_per_page;
            if(localStorage.getItem('items-per-page')){
                items_per_page = localStorage.getItem('items-per-page');
            } else {
                items_per_page = '5';
            }
            const expenses = await axios.get(`${baseURL}/user/expenses?page=1&items_per_page=${items_per_page}`, {headers: {"Authorization": token}}); 
            showExpense(expenses.data.expenses);
            renderPaginationButtons(expenses.data.lastPage, expenses.data.currentPage);
        } catch(err) {
            console.log(err);
            alert(err.message);
        }
    }
});

function showExpense(expenses){
    const tbody = document.querySelectorAll('tbody');
    tbody[1].innerHTML = '';
    
    expenses.forEach((expense) => {
        const formattedCreatedAt = formatCreatedAt(expense.createdAt);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${expense.amount}</td>
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td>${formattedCreatedAt}</td>
            <td>
                <button class="edit" onclick="editExpense(${expense.id})">Edit</button>
                <button class="delete" onclick="deleteExpense(${expense.id}, this)">Delete</button>
            </td>
        `;
        tbody[1].appendChild(tr);
    })

    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = 'Choose Category';
}

async function editExpense (id) {

    // populate these values in the input fields
    try {
        const token = localStorage.getItem('token');
        const {data:{amount: amountVal, description: descriptionVal, category: categoryVal }} = await axios.get(`${baseURL}/user/expenses/${id}`, {headers: {"Authorization": token}});
        document.getElementById('amount').value = amountVal;
        document.getElementById('description').value = descriptionVal;
        document.getElementById('category').value = categoryVal;
        document.getElementById('addBtn').style.display = 'none';
        document.getElementById('editBtn').style.display = 'inline-block';
    } catch(err){
        console.log(err);
        alert(err.message);
    }


    const editBtn = document.getElementById('editBtn');


    // Add a new event listener
    editBtn.addEventListener('click', editBtnClickHandler);

    async function editBtnClickHandler() {
        try {
            const inputAmount = document.getElementById('amount').value;
            const inputDescription = document.getElementById('description').value;
            const inputCategory = document.getElementById('category').value;
    
            const obj = {
                amount : inputAmount,
                description : inputDescription,
                category : inputCategory
            }
            
            document.getElementById('amount').value = '';
            document.getElementById('description').value = '';
            document.getElementById('category').value = 'Choose Category';
            document.getElementById('editBtn').style.display = 'none';
            document.getElementById('addBtn').style.display = 'inline-block';
    
            // update in database
            let token = localStorage.getItem('token');
            await axios.put(`${baseURL}/user/expenses/${id}`, obj, {headers: {"Authorization": token}});
            var items_per_page;
            if(localStorage.getItem('items-per-page')){
                items_per_page = localStorage.getItem('items-per-page');
            } else {
                items_per_page = '5';
            }
            const expenses = await axios.get(`${baseURL}/user/expenses?page=1&items_per_page=${items_per_page}`, {headers: {"Authorization": token}}); 
            showExpense(expenses.data.expenses);
            renderPaginationButtons(expenses.data.lastPage, expenses.data.currentPage);
            // Remove previous event listener if it exists
            editBtn.removeEventListener('click', editBtnClickHandler);
            
        } catch (err) {
            console.log(err);
            alert(err.message);
        }
    }
}

async function deleteExpense (id, event) {
    try {
        const tbody = document.querySelectorAll('tbody');
        const tr = event.parentElement.parentElement;
        tbody[1].removeChild(tr);
        const token = localStorage.getItem('token');
        await axios.delete(`${baseURL}/user/expenses/${id}`, {headers: {"Authorization": token}});
        var items_per_page;
        if(localStorage.getItem('items-per-page')){
            items_per_page = localStorage.getItem('items-per-page');
        } else {
            items_per_page = '5';
        }
        const expenses = await axios.get(`${baseURL}/user/expenses?page=1&items_per_page=${items_per_page}`, {headers: {"Authorization": token}}); 
        showExpense(expenses.data.expenses);
        renderPaginationButtons(expenses.data.lastPage, expenses.data.currentPage);
    } catch (err) {
        console.log(err);
        alert(err.message);
    }
}

document.getElementById('download-report').addEventListener('click', async() => {
    try {
        const token = localStorage.getItem('token');
        const expense = await axios.get(`${baseURL}/premium/download`, {headers: {"Authorization": token}});
    
        const fileLink = expense.data.fileURL; 
        console.log(fileLink);
            
        const link = document.createElement('a');
        link.href = fileLink;
        link.target = '_blank'; 
        link.download = ''; 
    
        link.click();
    } catch(err) {
        console.log(err);
        alert(err.message);
    }
})

document.getElementById('prev-downloads').addEventListener('click', async() => {
    try{
        const divList = document.querySelector('.download-report-list');
        if(divList.style.display == 'block'){
            divList.style.display = 'none';
            return;
        }
        const token = localStorage.getItem('token');
        const urls = await axios.get(`${baseURL}/premium/getreport`, {headers: {"Authorization": token}});
        divList.innerHTML = '';

        if(urls.data.length==0){
            divList.innerHTML = '<p>File Not Found</p>';
            divList.style.display = 'block';
            return;
        }

        urls.data.forEach((element, index) => {
            divList.innerHTML += `<p>File ${index+1}: <span>
                    <a href="${element.Url}" target="_blank">${formatCreatedAt(element.createdAt)}</a>
                    </span></p>`
        });
        divList.style.display = 'block';
    } catch(err) {
        console.log(err);
        alert(err.message);
    }
})

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
                    document.querySelector('.download-report').style.display = 'block';
                } catch(err) {
                    console.error(err);
                    alert('Failed to update transaction status.');
                }
            }
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();

        rzp1.on('payment.failed', async function (response) {
            try {
                await axios.post(`${baseURL}/user/updatetransactionstatus`, {
                    order_id: options.order_id,
                    payment_id: null,
                }, { headers: { "Authorization": token } });
            } catch (err) {
                console.error(err);
                alert('Failed to update transaction status.');
            }

            // Display a message to the user indicating payment failure
            alert('Payment failed. Please try again.');
        });
    } catch(err) {
        console.log(err);
        alert('Something went wrong. Please try again.');
    }
});