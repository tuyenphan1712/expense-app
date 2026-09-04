# Expense App — Ý tưởng & Định hướng sản phẩm

> Tài liệu brainstorm ban đầu cho một ứng dụng quản lý chi tiêu cá nhân.
>
> **Định hướng:** Mobile là sản phẩm chính cho người dùng cuối. Web chủ yếu phục vụ quản trị, quản lý và dashboard.
>
> Kiến trúc backend/mobile/web chi tiết: xem `docs/BE-ARCHITECTURE.md` · `docs/MOBILE-ARCHITECTURE.md` · `docs/WEB-ARCHITECTURE.md`. Schema: `docs/DATABASE.md`. File này chỉ giữ phần **product decision** (why), không lặp lại kiến trúc/DB.

---

## 1. Product Vision

Ứng dụng không chỉ đơn giản là:

> Nhập số tiền → chọn category → lưu.

Mục tiêu lớn hơn:

> **Giúp người dùng biết tiền của mình đang đi đâu và liệu họ có đang tiêu quá mức hay không.**

Core workflow:

```text
USER → GHI CHI TIÊU → PHÂN LOẠI → PHÂN TÍCH → "Tiền của tôi đang đi đâu?"
```

Ba nhiệm vụ chính:

1. Ghi nhận thu nhập / chi tiêu.
2. Phân loại giao dịch.
3. Phân tích để người dùng hiểu tình hình tài chính của mình.

---

## 2. Định hướng Platform

```text
                 Backend
                    │
          ┌─────────┴─────────┐
          │                   │
       Mobile                 Web
          │                   │
      End User              Admin
```

### Mobile — User App (sản phẩm chính)

- Dashboard, Thêm giao dịch, Lịch sử giao dịch, Budget, Analytics, Categories, Profile, Settings

### Web — Management / Admin

- Admin Dashboard, User Management, Category Management, Reports, System Settings, Audit Logs

---

## 3. MVP — Những chức năng đầu tiên

Không nên làm quá nhiều ngay từ đầu. MVP đề xuất gồm:

```text
Authentication → Transaction → Category → Dashboard → Budget → Analytics
```

---

## 4. Roadmap

### 4.1 Version 0.1 — MVP

```text
Authentication  → Register · Login · Profile
Transaction     → Create · Update · Delete · History
Category        → Default categories · Custom categories
Dashboard       → Income · Expense · Balance
Budget          → Set budget · Track budget
Analytics       → Monthly · Category
```

**Mục tiêu:** có một app quản lý chi tiêu thực sự usable.

### 4.2 Version 0.2

```text
Recurring expenses
Notifications
Multiple accounts
Better analytics
Export CSV/PDF
```

### 4.3 Version 0.3

```text
AI transaction input
AI spending analysis
Natural language queries
```

Ví dụ: *"Tháng này tôi đã tiêu bao nhiêu cho ăn uống?"* — AI truy vấn transaction data và trả lời.

### 4.4 Version 1.0

Định hướng: **Financial Assistant** = Expense Tracking + Budget + Analytics + AI + Personalized Insights.

---

## 5. Những chức năng KHÔNG nên làm ngay

```text
Bank integration · OCR hóa đơn · AI financial advisor · Investment tracking
Cryptocurrency · Stock portfolio · Multiple currencies · Family finance
Shared wallet · Subscription management · Voice assistant · Quá nhiều biểu đồ
```

Lý do: scope phải được kiểm soát — mỗi tính năng trên kéo sản phẩm gần hơn tới "Banking System / Financial Platform", vượt xa mục tiêu Expense App ban đầu.

---

## 6. Những câu hỏi product cần quyết định

Trước khi bắt đầu code, cần chốt các vấn đề sau.

### Tóm tắt quyết định

| Câu hỏi | Quyết định MVP |
|---|---|
| Target user | Người đi làm trẻ, 22–32 tuổi |
| Account model | Có model từ đầu, ẩn UI (1 account mặc định "Ví chính") |
| Income | Có ghi nhận, không phân loại chi tiết |
| Recurring transaction | Nút "Lặp lại giao dịch", không auto-generate |
| AI | v0.1–0.2: chỉ Parse. v0.3: + Analyze/Answer. v1.0: + Suggest |
| Offline | Offline-tolerant (local queue + auto sync), không full 2-way sync |

Chi tiết lý do từng quyết định ở các mục bên dưới.

### 6.1 Đối tượng người dùng

App dành cho: Sinh viên? Người đi làm? Người mới đi làm? Gia đình? Tất cả?

**✅ Quyết định:** **Người đi làm trẻ (22–32 tuổi, mới đi làm đến vài năm kinh nghiệm).**

- Không chọn "tất cả" vì sẽ làm loãng ưu tiên sản phẩm.
- Sinh viên chi tiêu đơn giản, ít cần multi-account hay budget dài hạn → nhu cầu thấp hơn.
- Gia đình cần shared wallet, phân quyền — vượt scope MVP.
- Người đi làm trẻ vừa đủ phức tạp (nhiều nguồn thu, nhiều ví/tài khoản: tiền mặt, ngân hàng, ví điện tử) để thực sự cần app, nhưng chưa cần các tính năng nâng cao như gia đình.
- Đây cũng là nhóm có xu hướng dùng app quản lý tài chính cá nhân nhiều nhất hiện tại.

Toàn bộ ưu tiên tính năng ở các mục sau nên bám theo persona này.

### 6.2 Account model

Có cần model Cash / Bank / E-wallet / Credit Card ngay từ MVP không?

**✅ Quyết định:** **Có model từ MVP, nhưng ẩn UI.**

- `transactions.account_id` thêm ngay từ MVP.
- Khi user đăng ký, tự động tạo 1 account mặc định tên "Ví chính".
- Mọi transaction MVP đều gán vào account này, user không thấy màn hình chọn/tạo account.
- UI Wallet đầy đủ (chọn/tạo nhiều account) để dành cho v0.2.

Lý do: nếu không có `account_id` ngay từ đầu, khi mở Wallet UI ở v0.2 sẽ phải migrate dữ liệu cũ (gán account mặc định cho toàn bộ transaction lịch sử) — rủi ro và tốn công hơn nhiều so với thêm 1 cột ẩn ngay từ đầu.

### 6.3 Income

Có quản lý thu nhập chi tiết (Salary / Freelance / Bonus / Other) không?

**✅ Quyết định:** **Có ghi nhận thu nhập, nhưng không phân loại chi tiết ở MVP.**

- MVP chỉ cần `type = INCOME` với 1 category mặc định duy nhất: "Thu nhập".
- Không breakdown thành Salary / Freelance / Bonus / Other ngay.

Lý do: mục tiêu chính của MVP là trả lời "tiền đang đi đâu" (phía chi tiêu), không phải phân tích nguồn thu. Breakdown thu nhập chi tiết để dành v0.2, khi đã có dữ liệu thực tế để biết user có thực sự cần phân loại nguồn thu hay không.

### 6.4 Recurring transaction

Có cần tự động tạo giao dịch định kỳ (tiền nhà, Netflix, điện, nước...) mỗi tháng không?

**✅ Quyết định:** **Không auto-generate ở MVP. Thay bằng nút "Lặp lại giao dịch này" (duplicate nhanh).**

- MVP: user tự tạo lại transaction cũ bằng 1 nút duplicate, chỉnh ngày rồi lưu — không cần scheduler, không cần xử lý edge-case (sửa 1 tháng có ảnh hưởng các tháng sau không, xoá thì sao...).
- Auto-recurring (tự động tạo mỗi tháng, nhắc nhở) để dành v0.2.

Lý do: giải quyết được ~80% nhu cầu (tiền nhà, Netflix, điện nước) với ~20% effort so với xây hệ thống recurring đầy đủ.

### 6.5 AI

AI sẽ chỉ Parse transaction, hay có thể Analyze spending / Answer questions / Give suggestions?

**✅ Quyết định:** **v0.1–v0.2: chỉ Parse transaction. v0.3: thêm Analyze spending + Answer questions. "Give suggestions" để dành v1.0.**

Lý do "Give suggestions" (đưa lời khuyên tài chính) bị đẩy xa nhất:

- Cần hiểu ngữ cảnh cá nhân sâu (thu nhập, mục tiêu, hoàn cảnh) mới đưa lời khuyên có giá trị.
- Rủi ro nếu AI khuyên sai — ảnh hưởng trực tiếp tới quyết định tài chính của user.
- Nên có nền tảng Analyze + đủ dữ liệu lịch sử trước khi thử suggestion.

AI ban đầu là **Input Layer + Analysis Layer**, chưa phải Financial Advisor.

### 6.6 Offline

Mobile có cần hoạt động khi không có Internet không? Đây là vấn đề kiến trúc quan trọng nếu app hướng mobile-first.

**✅ Quyết định:** **Offline-tolerant, không phải offline-first đầy đủ.**

```text
User tạo transaction (không mạng) → Lưu vào local queue → Có mạng trở lại → Tự động sync lên Backend
```

- Không cần 2-way sync hay xử lý conflict phức tạp, vì dữ liệu transaction về cơ bản là 1 chiều (user tạo → server nhận), hiếm khi 2 thiết bị cùng sửa 1 transaction cùng lúc.
- Chỉ cần: cho phép tạo/sửa/xoá transaction khi mất mạng, lưu local, tự đẩy lên server khi có mạng lại.

Lý do: đây là nơi user hay ghi chi tiêu nhất trong thực tế (quán ăn, hầm gửi xe, thang máy...) — nếu app "đứng hình" khi mất mạng sẽ ảnh hưởng trực tiếp đến core value (ghi tiền nhanh). Nhưng quyết định này nên chốt **sớm**, vì nó ảnh hưởng tới lựa chọn local DB (SQLite/WatermelonDB/Realm) trên mobile — sửa sau khi đã code sẽ tốn kém hơn nhiều so với sửa data model backend.

---

## 7. Product Principle & Core Philosophy

> **User không mở app để "quản lý database". User mở app để biết tình hình tiền của mình.**

```text
Input càng nhanh → Data càng sạch → Analytics càng tốt → Insight càng hữu ích → App càng có giá trị
```

Ưu tiên theo thứ tự: 1) Transaction UX → 2) Data model → 3) Dashboard → 4) Budget → 5) Analytics → 6) AI.

Không nên ưu tiên AI trước khi transaction system đủ tốt.

Phiên bản đầu tiên không cần phải có 100 chức năng. Một MVP tốt nên làm thật tốt 3 việc:

```text
1. Ghi tiền nhanh
2. Hiểu tiền đang đi đâu
3. Biết mình có đang tiêu quá nhiều hay không
```

Nếu ba việc này hoạt động tốt, những chức năng nâng cao như AI, OCR, voice, banking integration... có thể được xây dựng phía trên nền tảng đó.
