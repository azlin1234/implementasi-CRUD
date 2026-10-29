function proses(waktu:number, kegiatan:string): void {
    const start = Date.now();
    while (Date.now() - start < waktu) {
    }
    console.log(`${kegiatan} selesai`);
}

const waktumulai = Date.now();
console.log("mulai proses");
console.log("===");
proses (2, "jus jambu");
console.log('total waktu proses: ${date.now() -waktumulai / 1000'} detik );