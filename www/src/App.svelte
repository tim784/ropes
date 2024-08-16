<script lang="ts">
  import ropesLogo from '/ropes.svg';
  import packageJson from '../../package.json';
</script>

<main>
  <a href="/index.user.js" class="install-button">
    <div class="install-button-text">Install</div>
    <img src={ropesLogo} class="logo" alt="Ropes Logo" />
  </a>

  <h1>Ropes <span>for Empornium</span></h1>

  <p class="github">
    <a href={packageJson.repository.url}>Github</a>
  </p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }

  .install-button-text {
    font-size: 2em;
    font-weight: bold;
  }

  .install-button {
    color: #020617;
    background-color: #f1f5f9;
    border-radius: 1rem;
    border-color: #eee;
    border-width: 1px;
    border-style: solid;
    padding: 1rem;
    display: block;
    box-shadow:
      0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
    aspect-ratio: 1/1;
    max-width: fit-content;
    margin-inline-start: auto;
    margin-inline-end: auto;
    transition: box-shadow 300ms;
    transition: filter 300ms;
    text-decoration: none;
  }

  .install-button:hover,
  .install-button:focus-visible {
    filter: drop-shadow(0 0 1em #cc902988);
  }

  .github {
    font-size: 1.5em;
  }

  @media (prefers-color-scheme: dark) {
    .install-button {
      background-color: #1e293b;
      color: #f8fafc;
      border-color: #222;
    }
  }
</style>
