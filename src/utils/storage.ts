export function getLocation() {
    const zipCode = localStorage.getItem('zip');
    if (zipCode) return `00000${parseInt(zipCode)}`.slice(-5);
    else return null;
}

export function setLocation(zip: string) {
    localStorage.setItem('zip', zip.toString());
}