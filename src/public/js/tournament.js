const select = document.getElementById('tracking')
const button = document.getElementById('tracking-btn')

button.addEventListener("click", () => {
  location.href += '/'+select.value
})
