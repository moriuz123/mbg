const fs = require('fs');
let code = fs.readFileSync('src/app/(admin)/admin/pengawasan/page.tsx', 'utf8');

// Allow Admin Dinas to access the page
code = code.replace(
  /if \\(role !== 'sppg' && role !== 'operator_sppg'\\) \\{\\s*redirect\\('\\/admin'\\);\\s*\\}/,
  `if (role !== 'sppg' && role !== 'operator_sppg' && role !== 'admin_dinas' && role !== 'super_admin' && role !== 'admin') {
    redirect('/admin');
  }`
);

// Import getAdminLogisticsAnalytics
if (!code.includes('getAdminLogisticsAnalytics')) {
  code = code.replace(
    /import \\{ getPembelianBahan, getPemakaianBahan, getUjiRapidTest, getActiveMasterParameterUjiList, getKartuStok \\} from '@\\/app\\/actions\\/sppgPengawasan';/,
    `import { getPembelianBahan, getPemakaianBahan, getUjiRapidTest, getActiveMasterParameterUjiList, getKartuStok, getAdminLogisticsAnalytics } from '@/app/actions/sppgPengawasan';`
  );
}

// Fetch analytics
if (!code.includes('const analyticsData = isAdmin ? await getAdminLogisticsAnalytics() : null;')) {
  code = code.replace(
    /const kartuStok = await getKartuStok\\(\\);/,
    `const kartuStok = await getKartuStok();\n  const analyticsData = isAdmin ? await getAdminLogisticsAnalytics() : null;`
  );
}

// Pass to client
if (!code.includes('analyticsData={analyticsData}')) {
  code = code.replace(
    /userSppgId=\\{sppgId\\}/,
    `userSppgId={sppgId}\n        analyticsData={analyticsData}`
  );
}

fs.writeFileSync('src/app/(admin)/admin/pengawasan/page.tsx', code);
