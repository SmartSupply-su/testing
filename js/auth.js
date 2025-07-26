// Responsive Header
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("show");
}

document.addEventListener('DOMContentLoaded', function () {
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();

      // Close other open dropdowns
      document.querySelectorAll('.dropdown.open').forEach(d => {
        if (d !== dropdown) d.classList.remove('open');
      });

      // Toggle .open on the parent .dropdown
      dropdown.classList.toggle('open');
    });

    // Close dropdown when mouse leaves
    dropdown.addEventListener('mouseleave', function () {
      dropdown.classList.remove('open');
    });

    // Close when clicking outside
    document.addEventListener('click', function () {
      dropdown.classList.remove('open');
    });
  });
});

// Supabase
let supabase; // declare globally so all functions can use it

document.addEventListener("DOMContentLoaded", async () => {
  const supabaseUrl = 'https://pbekzjgteinnntprfzhm.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZWt6amd0ZWlubm50cHJmemhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNDM5MjYsImV4cCI6MjA2NDkxOTkyNn0.1yRQEisizC-MpDR6B5fJc2Z7Wzk1xcwsySyJMktSsF4';

  supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

  const currentPage = window.location.pathname;
  const protectedPages = ["home.html", "upload.html", "forecast.html", "sales.html", "inventory.html"];

  // ✅ Redirect to home.html if already logged in on index.html (login page)
  if (currentPage.endsWith("index.html") || currentPage === "/") {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      window.location.href = "home.html";
      return;
    } else {
      document.body.style.display = "block"; // show login form
    }
  }

  // ✅ Protect all secure pages
  if (protectedPages.some(p => currentPage.includes(p))) {
    await protectPage();
  }

  // ✅ Attach login form handler
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await login();
    });
  }

  // ✅ Attach logout button (if exists)
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await logout();
    });
  }

  // --- Functions ---

  async function login() {
    console.log("Login function triggered");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert("Login failed: " + error.message);
      console.error(error);
      return false;
    }

    window.location.href = "home.html"; // ✅ redirect to home after login
    return false;
  }

  async function protectPage() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "index.html"; // ✅ send to login page
    } else {
      document.body.style.display = "block"; // ✅ reveal page after session verified
    }
  }

  async function logout() {
    window.event?.preventDefault(); // Prevent default anchor behavior

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error);
      alert("Logout failed: " + error.message);
    }

    // Redirect to login page regardless of error
    window.location.replace("index.html");
}
});
});
