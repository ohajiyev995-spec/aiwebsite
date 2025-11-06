(() => {
  const btn = document.getElementById('themeToggle');
  const apply = (m) => {
    document.documentElement.dataset.theme = m;
    localStorage.setItem('theme', m);
  };
  const saved = localStorage.getItem('theme');
  if (saved) apply(saved);
  if (btn) {
    btn.addEventListener('click', () => {
      const cur = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      apply(cur);
    });
  }
  // Light theme variables if wanted (optional)
  if (document.documentElement.dataset.theme === 'light') {
    // Could swap CSS via class/data attribute; left as simple data flag.
  }

  // Global fallback data function usable by all pages
  window.TITANS_FALLBACK_DATA = async function TITANS_FALLBACK_DATA() {
    try {
      const r = await fetch('data/titans.json', { cache: 'no-store' });
      if (!r.ok) throw new Error('HTTP '+r.status);
      return await r.json();
    } catch(e) {
      // Fallback inline dataset (subset + expanded) to survive file:// and CORS issues
      return [
        {"slug":"colossal","name":"Colossal Titan","heightMeters":60,"type":"Colossal","category":"Nine","shifters":["Bertholdt Hoover","Armin Arlert"],"abilities":["Steam emission","Explosive transformation"],"weaknesses":["Slow","High stamina drain"],"firstAppearance":"S1E1","affiliations":["Various"],"image":"assets/img/colossal.svg","summary":"Skyscraper-class titan capable of catastrophic steam blasts.","funFact":"Transformation can generate a localized explosion.","spoilerLevel":"low"},
        {"slug":"armored","name":"Armored Titan","heightMeters":15,"type":"Armored","category":"Nine","shifters":["Reiner Braun"],"abilities":["Armor plates","Charges"],"weaknesses":["Exposed joints","Heavy"],"firstAppearance":"S1","affiliations":["Various"],"image":"assets/img/armored.svg","summary":"Heavily plated titan built for assault and defense.","funFact":"Can shed armor to regain speed.","spoilerLevel":"low"},
        {"slug":"beast","name":"Beast Titan","heightMeters":17,"type":"Beast","category":"Nine","shifters":["Zeke Yeager"],"abilities":["Devastating throws","Command presence"],"weaknesses":["Close quarters"],"firstAppearance":"S2","affiliations":["Various"],"image":"assets/img/beast.svg","summary":"Infamous for ranged dominance and battlefield control.","funFact":"Physiology varies by inheritor.","spoilerLevel":"low"},
        {"slug":"attack","name":"Attack Titan","heightMeters":15,"type":"Attack","category":"Nine","shifters":["Eren Yeager","Grisha Yeager","Kruger"],"abilities":["Agility","Future memory fragments (lore)"],"weaknesses":["Stamina"],"firstAppearance":"S1","affiliations":["Various"],"image":"assets/img/attack.svg","summary":"Balanced fighter renowned for relentless forward drive.","funFact":"Links willpower to glimpses across time.","spoilerLevel":"low"}
      ];
    }
  };
})();
