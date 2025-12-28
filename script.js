const form = document.querySelector(".todo-form");
const todoList = document.querySelector(".todo-list");
const nameInput = form.querySelector('input[type="text"]');
const linkInput = form.querySelector('input[type="url"]');
const giftDescription = document.getElementById("giftDescription");
const giftPriority = document.getElementById("giftPriority");
let isEditing = false;  
let editingId = null;    
const submitBtn = form.querySelector("button"); 

document.addEventListener("DOMContentLoaded", () => {
    if (typeof getGifts === "function") {
        getGifts().forEach(gift => createCard(gift));
    }

    setupCustomSelect();
    startCountdown();
});

form.addEventListener("submit", e => {
    e.preventDefault();

    const gift = {
        name: nameInput.value.trim(),
        link: linkInput.value.trim(),
        description: giftDescription.value.trim(),
        priority: giftPriority.value
    };

    if (!gift.name) return;

    if (isEditing) {
        const allCards = document.querySelectorAll(".todo-card");
        allCards.forEach(card => {
            if (card.querySelector(".card-title").textContent === editingId) {
                card.remove();
            }
        });

        if (typeof removeGift === "function") removeGift(editingId);
    }

    createCard(gift);
    if (typeof addGift === "function") addGift(gift);

    form.reset();
    resetCustomSelect(); 

    submitBtn.innerHTML = 'Add to list <i class="fa-solid fa-envelope-circle-check"></i>';

    isEditing = false;
    editingId = null;
    
    scrollToBottom();
});

function startCountdown() {
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");

    if (!daysEl || !hoursEl || !minutesEl) {
        console.log("Counter not found");
        return;
    }

    function updateTimer() {
        const now = new Date();
        const currentYear = now.getFullYear();
        
        let christmas = new Date(currentYear, 11, 25, 0, 0, 0);

        if (now > christmas) {
            christmas.setFullYear(currentYear + 1);
        }

        const diff = christmas - now;

        const d = Math.floor(diff / 1000 / 60 / 60 / 24);
        const h = Math.floor((diff / 1000 / 60 / 60) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);

        daysEl.innerText = d < 10 ? "0" + d : d;
        hoursEl.innerText = h < 10 ? "0" + h : h;
        minutesEl.innerText = m < 10 ? "0" + m : m;
    }
    setInterval(updateTimer, 1000);
    updateTimer(); 
}

function createCard(gift) {
    const card = document.createElement("div");
    card.classList.add("todo-card");

    const priorityText = {
        low: "🎁 Low",
        medium: "⭐ Medium",
        high: "🌟 High"
    };

    card.innerHTML = `
        <div class="card-header">
            <h3 class="card-title">${gift.name}</h3>
            <div class="card-actions">
                <button class="edit-btn" title="Edit">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                
                <button class="delete-btn" title="Delete">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>

        ${gift.description ? `<p class="card-description">${gift.description}</p>` : ""}
        ${gift.link ? `<a href="${gift.link}" class="card-link" target="_blank">View gift 🔗</a>` : ""}

        <div class="card-footer">
            <span class="card-priority">${priorityText[gift.priority] || gift.priority}</span>
        </div>
    `;

    card.querySelector(".delete-btn").addEventListener("click", () => {
        card.remove();
        if (typeof removeGift === "function") removeGift(gift.name);
    });

    card.querySelector(".edit-btn").addEventListener("click", () => {
        nameInput.value = gift.name;
        linkInput.value = gift.link;
        giftDescription.value = gift.description;
        
        setCustomSelectValue(gift.priority);

        isEditing = true;
        editingId = gift.name; 
        
        submitBtn.innerHTML = "Save changes";
        
        form.scrollIntoView({ behavior: "smooth" });
    });

    todoList.appendChild(card);
}

function scrollToBottom() {
    setTimeout(() => {
        todoList.scrollTo({
            top: todoList.scrollHeight, 
            behavior: 'smooth'       
        });
    }, 50);
}

function setupCustomSelect() {
    const selectOriginal = document.getElementById("giftPriority");
    
    selectOriginal.classList.add("hidden"); 

    const container = document.createElement("div");
    container.className = "custom-select";
    selectOriginal.parentNode.insertBefore(container, selectOriginal.nextSibling);

    const headboard = document.createElement("div");
    headboard.className = "select-headboard"; 
    headboard.textContent = selectOriginal.options[selectOriginal.selectedIndex].text;
    container.appendChild(headboard);

    const listOptions = document.createElement("div");
    listOptions.className = "select-options"; 
    
    for (let option of selectOriginal.options) {
        const item = document.createElement("div");
        item.className = "option"; 
        item.textContent = option.text;
        
        item.addEventListener("click", function() {
            headboard.textContent = option.text;
            selectOriginal.value = option.value;
            listOptions.classList.remove("view"); 
        });
        
        listOptions.appendChild(item);
    }
    
    container.appendChild(listOptions);

    headboard.addEventListener("click", function(e) {
        e.stopPropagation();
        listOptions.classList.toggle("view");
    });

    document.addEventListener("click", function(e) {
        if (!container.contains(e.target)) {
            listOptions.classList.remove("view"); 
        }
    });
}

function setCustomSelectValue(value) {
    const selectOriginal = document.getElementById("giftPriority");
    const headboard = document.querySelector(".select-headboard");
    const options = document.querySelectorAll(".option");

    selectOriginal.value = value;

    let textToShow = "⭐ Medium"; 
    for (let opt of selectOriginal.options) {
        if (opt.value === value) textToShow = opt.text;
    }
    
    if(headboard) headboard.textContent = textToShow;
}

function resetCustomSelect() {
    const selectOriginal = document.getElementById("giftPriority");
    const headboard = document.querySelector(".select-headboard");
    
    selectOriginal.value = "medium"; 
    if(headboard) headboard.textContent = "⭐ Medium"; 
}