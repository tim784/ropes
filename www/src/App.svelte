<script lang="ts">
  import ropesLogo from '/ropes.svg';
</script>

<main>
  <div>
    <img src={ropesLogo} class="logo" alt="Ropes Logo" />
  </div>
  <h1>Ropes <span>for Empornium</span></h1>

  <p>
    Get the latest version <a href="/index.user.js">here</a>.
  </p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #cc9029aa);
  }
</style>
