const fs = require('fs');
let code = fs.readFileSync('src/pages/CategoryPage.tsx', 'utf8');

code = code.replace(
  "import { RecentPostsWidget } from '../components/RecentPostsWidget';",
  ""
);

const recentPostsWidgetCall = `            <RecentPostsWidget
              posts={allPosts}
              onNavigate={onNavigate}
              onSelectPost={onSelectPost}
              title="🔥 Latest Jobs"
              subtitle="Recently added verified jobs and forms"
            />`;

code = code.replace(recentPostsWidgetCall, "");

fs.writeFileSync('src/pages/CategoryPage.tsx', code);
