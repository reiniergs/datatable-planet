const recordMetadata = {
    name: 'name',
    email: 'email',
    website: 'url',
    amount: 'currency',
    phone: 'phoneNumber',
    closeAt: 'dateInFuture',
};

const currencies = ['USD', 'EUR', 'MXN'];

export default function fetchDataHelper({ amountOfRecords }) {
    return fetch('https://data-faker.herokuapp.com/collection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
            amountOfRecords,
            recordMetadata,
        }),
    })
    .then(response => response.json())
    .then(collection => {
        return collection.map((row) => ({
            ...row,
            currencyCode: 'EUR',
            currencies,
        }));
    })
}