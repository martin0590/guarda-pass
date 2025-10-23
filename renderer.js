const information = document.getElementById("info");
const information_container = document.querySelector("#information_container")
const input_company = document.querySelector('#input_company')
const input_email = document.querySelector('#input_email')
const input_password = document.querySelector('#input_password')
const save_button = document.querySelector('#button_save')
const input_cel1 = document.querySelector('#input_cel1')
const input_cel2 = document.querySelector('#input_cel2')
const input_observation = document.querySelector('#input_observation')
const input_search = document.querySelector('#input_search')
const input_user = document.querySelector('#input_user')

let allTheCompanies

const fetchedInformation = async () => {
  const response = await window.electronAPI.fetchData()
  if(response.length === 0) return
  const parsedResponse = JSON.parse(response)
  createCompanyInformationDiv(parsedResponse)
}

const createCompanyInformationDiv = (arrInfo) => {
  for(let companyObj of arrInfo){
    const accountDiv = document.createElement("div")
    const span = document.createElement("p")
    span.id = "open-close"
    accountDiv.appendChild(span)
    accountDiv.id = "account_div"


    for(let [key, value] of Object.entries(companyObj)){
      const fieldDiv = document.createElement("div")
      fieldDiv.id = "field_div"

      if(key !== "company"){
        const accountLabel = document.createElement("p")
        accountLabel.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: `
        fieldDiv.appendChild(accountLabel)
        const accountData = document.createElement("p")
        accountData.textContent = value
        fieldDiv.appendChild(accountData)
      }else{
        fieldDiv.classList.add("company-name")
        const accountData = document.createElement("p")
        accountData.textContent = value.toUpperCase()
        fieldDiv.appendChild(accountData)
      }



      accountDiv.appendChild(fieldDiv)
    }
    information_container.appendChild(accountDiv)
  }
}

const clearInputs = () => {
  input_company.value = ""
  input_email.value = ""
  input_user.value = ""
  input_password.value = ""
  input_cel1.value = ""
  input_cel2.value = ""
  input_observation.value = ""
}

const saveInputsInformation = () => {
  const inputsArray = [input_company.value, input_user.value, input_email.value,input_password.value, input_cel1.value, input_cel2.value, input_observation.value]
  if(input_company.value.length === 0) return
  const informationObject = {}

  inputsArray.forEach((value, idx) => {
    switch(idx){
      case 0:
        if(inputsArray[idx]){
          informationObject.company = value
        }
        break
      case 1:
        if(inputsArray[idx]){
          informationObject.user = value
        }
      break
      case 2:
        if(inputsArray[idx]){
          informationObject.email = value
        }
        break
      case 3:
        if(inputsArray[idx]){
          informationObject.password = value
        }
        break
      case 4:
        if(inputsArray[idx]){
          informationObject.cel1 = value
        }
        break
      case 5:
        if(inputsArray[idx]){
          informationObject.cel2 = value
        }
        break
      case 6:
        if(inputsArray[idx]){
          informationObject.obervation = value
        }
        break
      default:
        break;
    }
  })

  window.electronAPI.sendObjData(informationObject)

  createCompanyInformationDiv([informationObject])
  
  clearInputs()
}

const handleSearchCompany = () => {
  if(Object.keys(allTheCompanies).length === 0) return
  const companyArray = Object.keys(allTheCompanies)
  const currentSearch = input_search.value.trim();
  const filteredArray = companyArray.filter(company => {
    const lowerWord = company.toLowerCase();
    return lowerWord.startsWith(currentSearch);
  })
  if(filteredArray.length > 0){
    information.innerText = JSON.stringify(filteredArray)
  }

}


save_button.addEventListener('click', saveInputsInformation)

document.addEventListener('DOMContentLoaded', function() {

    if (information_container) {
        information_container.addEventListener('click', function(event) {
            const accountSpan = event.target.closest('#open-close');
            if (accountSpan) {
                const accountDiv = event.target.closest('#account_div');
                accountSpan.classList.toggle('open');
                accountDiv.classList.toggle('open')
            }
        });
    }
});

fetchedInformation()