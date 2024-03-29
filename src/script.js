// global constants
const input_box_invalid_input_css_marker_class = "input-box-with-invalid-user-input";

const auto_update_toggle = document.querySelector("#auto-update-toggle");
const reset_sauce_count = document.querySelector("#reset-sauce-count");

// input boxes
const sauces_element = document.querySelector("#tallness_sauces");
const cm_element =  document.querySelector("#tallness_cm");
const mm_element = document.querySelector("#tallness_mm");
const nm_element = document.querySelector("#tallness_nm");
const inches_element = document.querySelector("#tallness_inches");
const m_element = document.querySelector("#tallness_m");
const dm_element = document.querySelector("#tallness_dm");
const um_element = document.querySelector("#tallness_um");
const km_element = document.querySelector("#tallness_km");
const miles_element = document.querySelector("#tallness_miles");
const yards_element = document.querySelector("#tallness_yards");
const borzoinoses_element = document.querySelector("#tallness_borzoinoses");
const plancks_element = document.querySelector("#tallness_plancks");

// force update buttons
const tallness_sauces_button = document.querySelector("#tallness_sauces_button");
const tallness_cm_button = document.querySelector("#tallness_cm_button");
const tallness_mm_button = document.querySelector("#tallness_mm_button");
const tallness_nm_button = document.querySelector("#tallness_nm_button");
const tallness_inches_button = document.querySelector("#tallness_inches_button");
const tallness_m_button = document.querySelector("#tallness_m_button");
const tallness_dm_button = document.querySelector("#tallness_dm_button");
const tallness_um_button = document.querySelector("#tallness_um_button");
const tallness_km_button = document.querySelector("#tallness_km_button");
const tallness_miles_button = document.querySelector("#tallness_miles_button");
const tallness_yards_button = document.querySelector("#tallness_yards_button");
const tallness_borzoinoses_button = document.querySelector("#tallness_borzoinoses_button");
const tallness_plancks_button = document.querySelector("#tallness_plancks_button");


/*
    Order of input_elements must be consistent with 
        - input_element_from_sauce_converters
            - from sauce converters must be exactly one less in count
            - from sauce converters must convert correctly for all input_elements to thier unit type
            - converter[0] must be for input_elements[1] and so on
            - must be inverse of input_element_to_sauce_converters (appoximately)
        - input_element_to_sauce_converters.
            - to sauce converters must be exactly one less in count 
            - must be inverse of input_element_from_sauce_converters (appoximately)
            - from sauce converters must convert correctly for all input_elements to thier unit type
            - converter[0] must be for input_elements[1] and so on
        - input_buttons
            - must be same size
            - indexes are the same input_elements, eg: input_element[0] is for input_button[0]

*/
const input_elements = [sauces_element, cm_element, mm_element, nm_element, inches_element, m_element, dm_element, um_element, km_element, miles_element, yards_element, borzoinoses_element, plancks_element]; 
const input_buttons = [tallness_sauces_button, tallness_cm_button, tallness_mm_button, tallness_nm_button, tallness_inches_button, tallness_m_button, tallness_dm_button, tallness_um_button, tallness_km_button, tallness_miles_button, tallness_yards_button, tallness_borzoinoses_button, tallness_plancks_button];

// sauces_to_x converters list
const input_element_from_sauce_converters = [sauces_to_cm, sauces_to_mm, sauces_to_nm, sauces_to_inches, sauces_to_m, sauces_to_dm, sauces_to_um, sauces_to_km, sauces_to_miles, sauces_to_yards, sauces_to_borzoinoses, sauces_to_plancks];
// x_to_sauces convertsers list
const input_element_to_sauce_converters = [cm_to_sauces, mm_to_sauces, nm_to_sauces, inches_to_sauces, m_to_sauces, dm_to_sauces, um_to_sauces, km_to_sauces, miles_to_sauces, yards_to_sauces, borzoinoses_to_sauces, plancks_to_sauces];

// conversion constants
const sauce_to_height_ratio_cm = 5.08;
const sauce_to_height_ratio_mm = 50.8;
const sauce_to_height_ratio_nm = 50800000.0;
const sauce_to_height_ratio_inches = 1.996062992126;
const sauce_to_height_ratio_m = 0.0508;
const sauce_to_height_ratio_dm = 0.508;
const sauce_to_height_ratio_um = 50800.0;
const sauce_to_height_ratio_km = 0.0000508;
const sauce_to_height_ratio_miles = 0.0000315657;
const sauce_to_height_ratio_yards = 0.0555555556;
const sauce_to_height_ratio_borzoinoses = 0.163934426229;
const sauce_to_height_ratio_plancks = 3143467095000000000000000000000000;

// keys
const local_storage_key1 = "last-sauce-count";
const local_storage_key2 = "auto-update-state";

// state storage
let input_elements_event_listeners = [];
let input_buttons_event_listeners = [];

// register button to switch on/off events
let auto_update_state = "on"; // or "off"
auto_update_toggle.addEventListener("click", (event)=> {
    let event_source = event.target;

    //console.log(input_elements);
    if (auto_update_state === "on") {
        let len = input_buttons_event_listeners.length;
        for (let i = 0; i < len; i++) {
            let handler = input_elements_event_listeners.shift();
            //console.log(handler);
            input_elements[i].removeEventListener("keyup", handler);
        }
    
        auto_update_state = "off";

        event_source.classList.add("disabled-auto-update");
        event_source.innerHTML = "Enable&nbsp; auto-update [off]";
    }
    else {
        // prevent double adding buttons
        let len = input_buttons_event_listeners.length;
        for (let i = 0; i < len; i++) {
            let handler = input_buttons_event_listeners.shift();
            input_buttons[i].removeEventListener("click", handler);
        }

        register_unit_conversion_handlers(input_elements, input_element_to_sauce_converters);
        
        auto_update_state = "on"

        event_source.classList.remove("disabled-auto-update");
        event_source.innerHTML = "Disable auto-update";
    }
});

// register button to clear localstorage
reset_sauce_count.addEventListener("click", (event) => {
    localStorage.setItem(local_storage_key1, "0");
    update_all("0", (sauces)=> sauces, sauces_element);
    sauces_element.value = 0;
});

// load any saved data from from localstorage
const last_sauces_count = localStorage.getItem(local_storage_key1);
if (last_sauces_count !== null) {
    sauces_element.value = last_sauces_count.toLocaleString("fullwide", {useGrouping: false});
    update_all(last_sauces_count, (sauces)=> sauces, sauces_element, false);
}


// add button click handlers and keyup handlers
register_unit_conversion_handlers(input_elements, input_element_to_sauce_converters);

// forward converters
function sauces_to_cm(number) {
    return number * sauce_to_height_ratio_cm;
}

function sauces_to_mm(number) {
    return number * sauce_to_height_ratio_mm;
}

function sauces_to_nm(number) {
    return number * sauce_to_height_ratio_nm;
}

function sauces_to_inches(number) {
    return number * sauce_to_height_ratio_inches;
}

function sauces_to_m(number) {
    return number * sauce_to_height_ratio_m; 
}

function sauces_to_dm(number) {
    return number * sauce_to_height_ratio_dm;
}

function sauces_to_um(number) {
    return number * sauce_to_height_ratio_um;
}

function sauces_to_km(number) {
    return number * sauce_to_height_ratio_km;
}

function sauces_to_miles(number) {
    return number * sauce_to_height_ratio_miles;
}

function sauces_to_yards(number) {
    return number * sauce_to_height_ratio_yards;
}

function sauces_to_borzoinoses(number) {
    return number * sauce_to_height_ratio_borzoinoses;
}

function sauces_to_plancks(number) {
    return number * sauce_to_height_ratio_plancks;
}


// backward converters
function cm_to_sauces(number) {
    return number / sauce_to_height_ratio_cm;
}

function mm_to_sauces(number) {
    return number / sauce_to_height_ratio_mm;
}

function nm_to_sauces(number) {
    return number / sauce_to_height_ratio_nm;
}

function inches_to_sauces(number) {
    return number / sauce_to_height_ratio_inches;
}

function m_to_sauces(number) {
    return number / sauce_to_height_ratio_m;
}

function dm_to_sauces(number) {
    return number / sauce_to_height_ratio_dm;
}

function um_to_sauces(number) {
    return number / sauce_to_height_ratio_um;
}

function km_to_sauces(number) {
    return number / sauce_to_height_ratio_km;
}

function miles_to_sauces(number) {
    return number / sauce_to_height_ratio_miles;
}

function yards_to_sauces(number) {
    return number / sauce_to_height_ratio_yards;
}

function borzoinoses_to_sauces(number) {
    return number / sauce_to_height_ratio_borzoinoses;
}

function plancks_to_sauces(number) {
    return number / sauce_to_height_ratio_plancks;
}


//  function write_input_element(text, element) {
//     element.value = text
//  }

//  function read_input_element(element) {
//     return element.value;
//  }

// walk through all elements to update them accordingly
function update_all(text_value, fn_value_to_sauces, element_updated) {
    // some of the hoisted variables
        let sauces_count;

        // reused in loop later
        let selected_input_element;
        let selected_converter;
        let selected_element_result;
        let selected_next_element;

    // update sauces element
    // calculate the rate in sauces
    const text_as_number = Number(text_value);
        
    // update css if tag is invalid
    if (!is_probably_a_number(text_as_number)) {
        element_updated.classList.add(input_box_invalid_input_css_marker_class);
        element_updated.setAttribute("aria-invalid", "true");
        return;
    }
    else {
        if (element_updated.classList.contains(input_box_invalid_input_css_marker_class)) {
            element_updated.classList.remove(input_box_invalid_input_css_marker_class);
            element_updated.setAttribute("aria-invalid", "false");
        }
    }

    sauces_count = fn_value_to_sauces(text_as_number);

    // only write to sauces output if the user didn't type into it
    if (element_updated !== sauces_element) {
        sauces_element.value = `${sauces_count.toLocaleString("fullwide", {useGrouping: false})}`;
    }

    // update the rest of the elements
    for (let i = 0; i < input_element_from_sauce_converters.length; i++) {
        // get the iteration's things
        selected_input_element = input_elements[i];
        selected_converter = input_element_from_sauce_converters[i];
        selected_next_element = input_elements[i+1];

        // skip updating the box the user typed in
        if (element_updated === selected_next_element) {
            continue;
        }
        
        // convert the number's unit type with the function
        selected_element_result = selected_converter(sauces_count);
        
        // write to the next box
        selected_next_element.value = `${selected_element_result.toLocaleString("fullwide", {useGrouping: false})}`;

        // update next box's error signs
        if (!is_probably_a_number(selected_element_result)) {
            selected_next_element.classList.add(input_box_invalid_input_css_marker_class);
            selected_next_element.setAttribute("aria-invalid", "true");
            return;
        }
        else {
            if (selected_next_element.classList.contains(input_box_invalid_input_css_marker_class)) {
                selected_next_element.classList.remove(input_box_invalid_input_css_marker_class);
                selected_next_element.setAttribute("aria-invalid", "false");
            }
        }
    }

    // save sacues count to browser
    localStorage.setItem(local_storage_key1, sauces_count);
}

// // https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
// function round_2_decimal_places(value) {
//     return Math.round((value + Number.EPSILON) * 100)  / 100;
// }

// helper
function is_probably_a_number(value) {
    return (!isNaN(value) && isFinite(value))
}

function is_key_string_1digit_number(keyboard_event_key) {
    switch(keyboard_event_key) {
        case "1" : 
        case "2" : 
        case "3" : 
        case "4" : 
        case "5" : 
        case "6" : 
        case "7" : 
        case "8" : 
        case "9" : 
            return true; break;

        default: 
            return false;  
    }
}

function register_unit_conversion_handlers(input_elements, to_sauce_converters) {
    // register root element
    function keyup_handler (keyboard_event) {
        const source_element = keyboard_event.target;
        const element_text = source_element.value;

        update_all(element_text, (sauces)=> sauces, source_element);
    };
    input_elements_event_listeners.push(keyup_handler);
    input_elements[0].addEventListener("keyup", keyup_handler);

    function click_handler (keyboard_event) {
        const source_element = input_elements[0];
        const element_text = source_element.value;
        
        update_all(element_text, (sauces)=> sauces, source_element);
        //console.log(`registered element with id: ${input_buttons[0].id} button with id ${input_buttons[0].id}`);
    };
    input_buttons_event_listeners.push(click_handler);
    input_buttons[0].addEventListener("click", click_handler);

    // register the remaining input elements and buttons
    for (let i = 1; i < input_elements.length; i++) {
        let element_selected = input_elements[i];
        let button_selected = input_buttons[i];
        let converter_selected = to_sauce_converters[i-1];
        
        function keyup_handler2(keyboard_event) {
            const source_element = keyboard_event.target;
            const element_text = source_element.value;

            update_all(element_text, converter_selected, element_selected);
        };
        input_elements_event_listeners.push(keyup_handler2);
        element_selected.addEventListener("keyup", keyup_handler2);
        
        function click_handler2(keyboard_event) {
            const source_element = element_selected;
            const element_text = source_element.value;

            update_all(element_text, converter_selected, element_selected);
            //console.log(`I am for ${source_element.id}`);
        };
        input_buttons_event_listeners.push(click_handler2);
        button_selected.addEventListener("click", click_handler2);

        //console.log(`registered element with id: ${element_selected.id} with converter '${converter_selected}' and button with id ${button_selected.id}`);
    }
}

