const addBtn = document.querySelector(".add_btn");
const rmvBtn = document.querySelector(".rmv_btn");
const toDisplayTicket = document.querySelector(".ticket_det_cont");
const col_cat_selectors = document.querySelectorAll(".cat_picker");
const ticket_text_cont = document.querySelector(".ticket_det_cont");
const text_area_cont = document.querySelector(".textare_cont");
const main_ticket_area = document.querySelector(".main_cont");
const allcolors = ['lightblue','lightgreen','lightpink', 'black'];
let arrTickets =[];
const lockIconClass = 'fa-lock';
const unlockIconClass = 'fa-lock-open';

let tickDisplay = false;
let tick_to_be_created_color = 'lightgreen';
let rmv_tick_flag = false;

console.log(" vamsi",col_cat_selectors)
console.log(" vamsi",col_cat_selectors[0])
console.log(" vamsi",col_cat_selectors[0].classList[0])

console.log(allcolors)

addBtn.addEventListener('click', event =>{
    tickDisplay = !tickDisplay;
    
    if (tickDisplay){
        toDisplayTicket.style.display="flex";
    } else{
        toDisplayTicket.style.display="none";
    }

})



col_cat_selectors.forEach(col_selected =>{
    col_selected.addEventListener('click', event =>{
        // Remove the highlight box for (if it is enabled)
        // To remove, run the loop and remove for all
        col_cat_selectors.forEach(rmv_high =>{
            rmv_high.classList.remove("highlight");
        })
        // Now, add highlight for the selected box
        col_selected.classList.add("highlight")
        tick_to_be_created_color =  col_selected.classList[0];
    })  
})


// Create Ticket

ticket_text_cont.addEventListener("keydown", event =>{
    const keyPressed = event.key;
    
    if (keyPressed === 'Shift') {
        // event.preventDefault();
        const tick_to_be_created_desc = text_area_cont.value;
        const tick_to_be_created_id = Date.now();
        createTicket(tick_to_be_created_color, tick_to_be_created_desc,tick_to_be_created_id);
        
        ticket_text_cont.style.display = "none"
        tickDisplay = !tickDisplay;

        text_area_cont.value = "";
    }
})  

const createTicket = (col, desc, id)=> {

    // console.log(col, desc, id)
    const new_ticket_cont = document.createElement("div");

    new_ticket_cont.classList.add("ticket_cont");
    new_ticket_cont.innerHTML= `<div class="ticcont_id ${col}"></div>
                               <div class="tickcont_title">${id}</div>
                               <div class="ticcont_desc">${desc}</div>
                               <div class="ticket_lock">
                               <i class="fa-solid fa-lock"></i>
                               </div>`
    
    main_ticket_area.appendChild(new_ticket_cont);

    const new_obj_mdata = {
        col,
        id,
        desc
        
    }
    arrTickets.push(new_obj_mdata);
    localStorage.setItem("tickets", JSON.stringify(arrTickets));
    

    handleDeleteTicket(new_ticket_cont);

    handleCategory(new_ticket_cont);

    handleLok(new_ticket_cont);
}


// Delete a Ticket

rmvBtn.addEventListener('click', event =>{
    rmv_tick_flag = !rmv_tick_flag
    if (rmv_tick_flag) {
        window.alert("Delete mode activated")
        rmvBtn.style.color = "red"
    }
    else {
        rmvBtn.style.color = "white"

    }
})

//Deleting a ticket
const handleDeleteTicket = ticket =>{
    
    ticket.addEventListener('click', event =>{      
        if (rmv_tick_flag) {
            debugger
            const cur_tick_id = ticket.children[1].innerText;
            window.alert(cur_tick_id);

            const index_of_ticket = arrTickets.findIndex(t =>{
                return t.id == cur_tick_id
            })
            
            arrTickets.splice(index_of_ticket, 1);
            localStorage.setItem("tickets", JSON.stringify(arrTickets));

            
            ticket.remove();
        }
    })
    
    
}

//Changing color of the ticket.
const handleCategory = cat_to_be_changed =>{
    const ticket_color_band = cat_to_be_changed.querySelector(".ticcont_id");

    ticket_color_band.addEventListener('click', event =>{

        const current_color = ticket_color_band.classList[1];

        let current_color_index = allcolors.findIndex(color =>{
            return color == current_color
        })

        current_color_index++;

        // window.alert(current_color_index);

        new_color_index = current_color_index%allcolors.length;
        
        const new_color = allcolors[new_color_index];

        ticket_color_band.classList.remove(current_color)

        ticket_color_band.classList.add(new_color);

        const curr_ticket_id = cat_to_be_changed.querySelector(".tickcont_title").innerText;

        arrTickets.forEach(t =>{
            if (curr_ticket_id == t.id){
                t.col = new_color;
            }
        })
        localStorage.setItem("tickets", JSON.stringify(arrTickets));



    })
    

}

//changing lock Unlock feature
const handleLok = ticket => {
    const ticketLockElement = ticket.querySelector(".ticket_lock");
    const text_desc_edit = ticket.querySelector(".ticcont_desc");

    const lockUnlock = ticketLockElement.children[0];

    lockUnlock.addEventListener('click', event =>{
            if (lockUnlock.classList.contains(lockIconClass)){
                //Remove lockIconClass
                lockUnlock.classList.remove(lockIconClass)
                
                //Add unLockIconClass
                lockUnlock.classList.add(unlockIconClass)
                
                //Make the text area editable
                text_desc_edit.setAttribute('contenteditable', 'true');
                
            } else {
                //Remove the unlockIconClass
                lockUnlock.classList.remove(unlockIconClass);

                //Add the lockIconClass
                lockUnlock.classList.add(lockIconClass);

                //Lock the text area
                text_desc_edit.setAttribute('contenteditable', 'false');

                // Update in Array also
                const current_ticket_id = ticket.querySelector(".tickcont_title").innerText;
                
                const new_desc = ticket.querySelector(".ticcont_desc").innerText;
                
                arrTickets.forEach(t => {
                    
                    if (t.id == current_ticket_id) {
                        t.desc = new_desc
                    }
                })
                localStorage.setItem("tickets", JSON.stringify(arrTickets));


            }
            
    })

}

//Flitering by color selected

const fltr_by_cat = document.querySelectorAll(".only_box");
let prev_sel_colr = 'none';

fltr_by_cat.forEach(fltr =>{
    fltr.addEventListener('click', event =>{
        const sel_colr = fltr.classList[1];
        if (sel_colr === prev_sel_colr){
            // Show all tickets as this is double click condition
            const allTickets = document.querySelectorAll(".ticcont_id")
                allTickets.forEach(indTiket =>{
                    indTiket.parentElement.remove();
                })  
                
            for(let i=0; i<arrTickets.length; i++){
                const new_ticket = document.createElement("div");

                new_ticket.classList.add("ticket_cont");
                new_ticket.innerHTML= `<div class="ticcont_id ${arrTickets[i].col}"></div>
                                        <div class="tickcont_title">${arrTickets[i].id}</div>
                                        <div class="ticcont_desc">${arrTickets[i].desc}</div>
                                        <div class="ticket_lock">
                                        <i class="fa-solid fa-lock"></i>
                                        </div>` 
                main_ticket_area.appendChild(new_ticket);

                handleDeleteTicket(new_ticket);
                handleCategory(new_ticket);
                handleLok(new_ticket);
            }

            }
        else {
                // Remove all the tickets from window
                const allTickets = document.querySelectorAll(".ticcont_id")
                allTickets.forEach(indTiket =>{
                    indTiket.parentElement.remove();
                })
                //run a loop and add the tickets matching color
                for(let i=0; i<arrTickets.length; i++){
                    if (arrTickets[i].col === sel_colr) {
                        const new_ticket = document.createElement("div");

                        new_ticket.classList.add("ticket_cont");
                        new_ticket.innerHTML= `<div class="ticcont_id ${arrTickets[i].col}"></div>
                                                <div class="tickcont_title">${arrTickets[i].id}</div>
                                                <div class="ticcont_desc">${arrTickets[i].desc}</div>
                                                <div class="ticket_lock">
                                                <i class="fa-solid fa-lock"></i>
                                                </div>` 
                        main_ticket_area.appendChild(new_ticket);
                        handleDeleteTicket(new_ticket);
                        handleCategory(new_ticket);
                        handleLok(new_ticket);
                    }
                }
                prev_sel_colr = sel_colr;
            }
    })
})

const tickets_from_localStorage = localStorage.getItem("tickets");

if (tickets_from_localStorage) {
    arrTickets = JSON.parse(tickets_from_localStorage);
    arrTickets.forEach(ticket =>{
        const new_ticket = document.createElement("div");
        new_ticket.classList.add("ticket_cont");
        new_ticket.innerHTML= `<div class="ticcont_id ${ticket.col}"></div>
                                <div class="tickcont_title">${ticket.id}</div>
                                <div class="ticcont_desc">${ticket.desc}</div>
                                <div class="ticket_lock">
                                <i class="fa-solid fa-lock"></i>
                                </div>` 
        main_ticket_area.appendChild(new_ticket);
        handleDeleteTicket(new_ticket);

        handleCategory(new_ticket);
    
        handleLok(new_ticket);
    })

}
