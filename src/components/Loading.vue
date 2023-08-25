
<template>
  <Transition>
    <div class="fixed-full flex-center bg">
      <div class="loading">
        <svg xmlns="http://www.w3.org/2000/svg" class="loading-icon" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="5" x2="12" y2="3" />
          <line x1="17" y1="7" x2="18.4" y2="5.6" />
          <line x1="19" y1="12" x2="21" y2="12" />
          <line x1="17" y1="17" x2="18.4" y2="18.4" />
          <line x1="12" y1="19" x2="12" y2="21" />
          <line x1="7" y1="17" x2="5.6" y2="18.4" />
          <line x1="6" y1="12" x2="4" y2="12" />
          <line x1="7" y1="7" x2="5.6" y2="5.6" />
        </svg>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fixed-full {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  flex-direction: column;
}

.bg {
  background-color: transparent;
  /* background-color: var(--color-bg); */
  opacity: 0.85;
  transition: all 0.25s;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  opacity: 1;
  box-shadow: 0px 2px 10px rgb(0 0 0 / 10%);
  background-color: var(--color-bg);

}

.loading-icon {
  width: 1.75rem;
  height: 1.75rem;
  stroke: #706b66;
  animation: rotate 3s linear infinite;
  background-color: #fffdf2;
}


@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
