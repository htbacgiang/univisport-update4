# SEO Intelligence Center

Module SEO Intelligence Center dùng dữ liệu thật từ MongoDB models hiện có của website. Các nguồn chưa tích hợp như Google Search Console, GA4, Ahrefs, Semrush và CSV import được hiển thị là `Chưa tích hợp`, không sinh dữ liệu giả.

## Trang quản trị

- `/dashboard/seo`: SEO Intelligence Center, KPI, bộ lọc, menu module, biểu đồ và trạng thái nguồn dữ liệu.
- `/dashboard/seo/content`: Content inventory cho bài viết và sản phẩm, hỗ trợ search, filter, sort, status và actionable recommendations.
- `/dashboard/seo/keyword-hub`: Keyword Hub từ primary keyword thật; volume/KD/ranking chờ nguồn dữ liệu ngoài.
- `/dashboard/seo/topical-map`: Cây topical authority dạng Pillar -> Cluster, coverage score và entity analysis.
- `/dashboard/seo/entities`: Entity dictionary coverage, frequency, missing URL.
- `/dashboard/seo/internal-links`: Source URL, Target URL, Anchor, Type, Status; phát hiện Weak Link, Orphan, Too Many Links từ content thật.

## API

- `GET /api/seo/audit`: trả toàn bộ SEO audit payload.
- `GET /api/seo/audit?url=/bai-viet/{slug}`: audit một URL bài viết.
- `GET /api/seo/audit?url=/san-pham/{slug}`: audit một URL sản phẩm.

Chi tiết response xem [docs/seo-audit-api.md](./docs/seo-audit-api.md).

## Nguồn dữ liệu

Module tự đọc:

- `Post` từ `models/Post.ts`
- `Product` từ `models/Product.js`
- `Author` qua populate `postAuthor`

Không có mock data, không hardcode danh sách bài viết/sản phẩm, không tạo dữ liệu giả.

## Migration

Không cần migration. Module hiện tại chỉ đọc dữ liệu và phân tích runtime.

## Cách hoạt động

Logic chính nằm trong `lib/seo-audit.ts`:

- Chuẩn hóa inventory từ Post/Product.
- Parse HTML content bằng `htmlparser2`/`domutils`.
- Chấm điểm Title, Meta, URL, Heading, Content Quality, Internal Links, Images, Schema và E-E-A-T.
- Trích xuất entity từ title, content và FAQ bằng dictionary SEO 1-4 từ, không đếm stop words/từ đơn vô nghĩa.
- Tạo Keyword Hub từ primary keyword thật, phân loại intent/priority dựa trên nội dung audit.
- Trích xuất Internal Link từ HTML content thật và phân loại Strong, Weak Link, Orphan, Too Many Links.
- Tạo topical map từ category, primary keyword và entity signals.
- Sinh issues/suggestions cho từng URL.

## Dependency

Dashboard sử dụng `recharts` cho biểu đồ. Dependency đã được thêm vào `package.json` và `package-lock.json`.
