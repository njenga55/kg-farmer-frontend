<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import upgradeBannerDark from '@images/pro/upgrade-banner-dark.png'
import upgradeBannerLight from '@images/pro/upgrade-banner-light.png'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
import { useTheme } from 'vuetify'

import { useStore } from 'vuex' // Import useStore from vuex



// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'

const vuetifyTheme = useTheme()

const upgradeBanner = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? upgradeBannerLight : upgradeBannerDark
})

// Initialize store with useStore
const store = useStore()


const receivedUser = computed(() => store.getters.getUser) 
</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="bx-menu" />
        </IconBtn>

        <!-- 👉 Search -->
        <div
          class="d-flex align-center cursor-pointer"
          style="user-select: none;"
        >
          <!-- 👉 Search Trigger button -->
          <!--
            <IconBtn>
            <VIcon icon="bx-search" />
            </IconBtn> 
          -->

          <span class="d-none d-md-flex align-center text-disabled">
            <span class="text-md-h5 text-primary">Welcome {{ receivedUser.name.split(' ')[0
              
            ] }}! 🎉</span>
            <!-- <span class="meta-key">&#8984;K</span> -->
          </span>
        </div>

        <VSpacer />

        <NavbarThemeSwitcher class="me-2" />

        <UserProfile />
      </div>
    </template>

    <template #vertical-nav-content>
      <VerticalNavLink
        :item="{
          title: 'Dashboard',
          icon: 'bx-home',
          to: '/dashboard',
        }"
      />

      <!--
        👉 
        Reports
      -->
      <VerticalNavSectionTitle
        :item="{
          heading: 'Reports',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'General Reports',
          icon: 'mdi-chart-line',
          to: '/reports',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Daily Reports',
          icon: 'mdi-calendar-text',
          to: '/daily-reports',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Reports & Exports',
          icon: 'mdi-file-export-outline',
          to: '/reports-export',
        }"
      />

      <!-- 👉 Loans management -->
      <VerticalNavSectionTitle
        :item="{
          heading: 'Funds management',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Loan',
          icon: 'mdi-bank',
          to: '/loans',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Money Transfer',
          icon: 'mdi-transfer',
          to: '/send-money',
        }"
      />

      <!-- 👉 Loans management -->
      <VerticalNavSectionTitle
        :item="{
          heading: 'Offered services',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Airtime',
          icon: 'mdi-sim',
          to: '/airtime',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'KPLC Tokens',
          icon: 'mdi-flash',
          to: '/tokens',
        }"
      />

      <!-- 👉 Airtime management -->
      <VerticalNavSectionTitle
        :item="{
          heading: 'Opt in Farmers',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Farmers',
          icon: 'mdi-tractor',
          to: '/farmers',
        }"
      />

      <!-- 👉 Produce management -->
      <VerticalNavSectionTitle
        :item="{
          heading: 'Produce in kilos',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Produce',
          icon: 'mdi-weight-kilogram',
          to: '/produce',
        }"
      />

      <!-- 👉 Produce management -->
      <VerticalNavSectionTitle
        :item="{
          heading: 'System Activities',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Logs',
          icon: 'mdi-history',
          to: '/system-logs',
        }"
      />
      

      <!-- 👉 Account settings -->
      <VerticalNavSectionTitle
        :item="{
          heading: 'System users',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Users',
          icon: 'mdi-accounts',
          to: '/users',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Account Settings',
          icon: 'mdi-account-cog-outline',
          to: '/account-settings',
        }"
      />
    </template>


    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}
</style>
