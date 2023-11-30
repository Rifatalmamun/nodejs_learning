const deleteProduct = (btn) => {
    const id = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const productElement = btn.closest('article');

    fetch('/admin/delete/product/'+id, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    }).then(response => {
        return response.json();
    }).then(data => {
        productElement.parentNode.removeChild(productElement);
    }).catch(error => {
        console.log(error);
    })
}