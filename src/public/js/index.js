const shortid = document.getElementById('shortid')
const go = document.getElementById('go')

go.addEventListener("click", () => {
  location.pathname = `/`+shortid.value
})
