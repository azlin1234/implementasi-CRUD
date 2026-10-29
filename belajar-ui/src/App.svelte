<script lang="ts">
  import { onMount } from 'svelte';

  let items = $state([]);
  let tinggi = $state<number | ''>('');
  let berat = $state<number | ''>('');
  let usia = $state<number | ''>('');
  let gender = $state('Laki-laki');
  let editingId = $state<number | null>(null);

  async function fetchItems() {
    try {
      const res = await fetch('http://localhost:3000/items');
      const result = await res.json();
      if (result.success) items = result.data;
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();

    const payload = {
      tinggi: Number(tinggi),
      berat: Number(berat),
      usia: Number(usia),
      gender
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`http://localhost:3000/items/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('http://localhost:3000/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const result = await res.json();
      if (result.success) {
        resetForm();
        fetchItems();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (err) {
      alert('Gagal terhubung ke backend!');
    }
  }

  function startEdit(item: any) {
    editingId = item.id;
    tinggi = item.tinggi_badan;
    berat = item.berat_badan;
    usia = item.usia;
    gender = item.gender || 'Laki-laki';
  }

  function resetForm() {
    editingId = null;
    tinggi = '';
    berat = '';
    usia = '';
    gender = 'Laki-laki';
  }

  async function handleDelete(id: number) {
    if (confirm('Hapus data ini?')) {
      await fetch(`http://localhost:3000/items/${id}`, { method: 'DELETE' });
      fetchItems();
    }
  }

  onMount(fetchItems);
</script>

<main style="padding: 20px; font-family: sans-serif;">
  <h2>Data Fisik Pengguna</h2>

  <form onsubmit={handleSubmit} style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
    <input type="number" placeholder="Tinggi (cm)" bind:value={tinggi} required />
    <input type="number" placeholder="Berat (kg)" bind:value={berat} required />
    <input type="number" placeholder="Usia (tahun)" bind:value={usia} required />
    
    <select bind:value={gender}>
      <option value="Laki-laki">Laki-laki</option>
      <option value="Perempuan">Perempuan</option>
    </select>

    <button type="submit">{editingId ? 'Simpan Edit' : 'Tambah Data'}</button>
    {#if editingId}
      <button type="button" onclick={resetForm}>Batal</button>
    {/if}
  </form>

  <table border="1" cellpadding="8" cellspacing="0">
    <thead>
      <tr>
        <th>ID</th>
        <th>Tinggi (cm)</th>
        <th>Berat (kg)</th>
        <th>Usia</th>
        <th>Gender</th>
        <th>Aksi</th>
      </tr>
    </thead>
    <tbody>
      {#each items as item}
        <tr>
          <td>{item.id}</td>
          <td>{item.tinggi_badan}</td>
          <td>{item.berat_badan}</td>
          <td>{item.usia}</td>
          <td>{item.gender}</td>
          <td>
            <button onclick={() => startEdit(item)}>Edit</button>
            <button onclick={() => handleDelete(item.id)}>Hapus</button>
          </td>
        </tr>
      {:else}
        <tr>
          <td colspan="6" style="text-align: center;">Belum ada data</td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>