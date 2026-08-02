// ============================================================
// PHẦN 1: HỆ THỐNG ĐA NGÔN NGỮ (i18n)
// ============================================================
const T = {
  en: {
    slogan:"Tech and more", tagline:"Tech and more",
    nav_login:"Log in", nav_account:"Account", nav_register:"Sign up", nav_logout:"Log out", menu_faq:"Frequently Asked Questions", auth_forgot:"Forgot password?", auth_forgot_title:"Forgot password", auth_back_login:"← Back to sign in", auth_send_reset:"Send reset link", auth_login_title:"Sign in", auth_register_title:"Create account", auth_no_account:"Don't have an account?", auth_has_account:"Already have an account?", auth_given_name:"Given name", auth_given_name_ph:"e.g. John", auth_last_name:"Last name", auth_last_name_ph:"e.g. Smith", auth_confirm_password:"Confirm password", auth_password:"Password", auth_create:"Create account", auth_login:"Sign in", auth_register:"Sign up", auth_name:"Name",
    hero_quote:"It's not that the world is too dark but that we've grown used to not lighting ourselves up.", nav_home:"Home", nav_tools:"Tools", nav_learn:"Learn", nav_read:"Read", nav_message:"Message", nav_cuibap:"Cùi Bắp",
    home_eyebrow:"A place to return to",
    home_h1:"Where ideas grow into <em>tools that matter</em>",
    home_sub:"Querencia builds thoughtful tools for curious minds. privacy-first, beautifully crafted, and built to last.",
    home_cta1:"Explore Tools", home_cta2:"Read More",
    home_card_tools:"Carefully designed instruments to help you think, create, and work better. Free and Pro plans available.",
    home_card_tools_arrow:"Explore Tools →",
    home_card_learn:"Structured resources, guides, and lessons for those who want to go deeper on what matters.",
    home_card_learn_arrow:"Start Learning →",
    home_card_read:"Essays, ideas, and reflections on technology, craft, and building things worth building.",
    home_card_read_arrow:"Start Reading →",
    home_note:"Built by one person, for everyone. <span>querencia.com.vn</span>",
    footer_copy:"© 2026 Querencia · All rights reserved", footer_links:"Privacy · Security · Terms", footer_tagline:"Querencia is ad-free and never sells your data. We're funded solely by our paid tools.",
    tools_title:"",
    tools_desc:"Every tool here is built with care: clean, fast, and privacy-respecting. Choose the plan that fits you.",
    badge_free:"Free", coming_soon:"Coming soon",
    tool1_name:"Tool One", tool1_desc:"A placeholder for the first tool. This space is reserved for something great.",
    tool2_name:"Tool Two", tool2_desc:"Advanced features for users who need more power and flexibility.",
    tool3_name:"Tool Three", tool3_desc:"Another thoughtful instrument being crafted with intention.",
    plan_free:"Free", plan_free_period:"/ forever", plan_free_desc:"All the essentials. No ads, no tracking. Ever.",
    free_f1:"Access to all free tools", free_f2:"Standard usage limits", free_f3:"Community support",
    plan_pro_desc:"Extended limits, priority features, and full access.",
    pro_f1:"Unlimited tool usage", pro_f2:"Early access to new tools", pro_f3:"Priority support", pro_f4:"Cross-platform sync",
    plan_team:"Team", plan_team_desc:"For groups and organizations who need more.",
    team_f1:"Everything in Pro", team_f2:"Team collaboration features", team_f3:"Admin controls", team_f4:"Custom integrations",
    learn_title:"", learn_desc:"",
    learn_soon_title:"Content in progress", learn_soon_desc:"This section is being built thoughtfully. Check back soon for courses and learning resources.",
    read_title:"", read_desc:"Deep essays and thoughts on building, technology, and the art of making things that last.",
    read_soon_title:"First post coming soon", read_soon_desc:"Writing takes time to do well. The first piece will be worth the wait.",
    app_label:"App", app_desc:"An app experience. available directly in your browser, and on mobile.",
    app_wip:"This app is under development. It will be available here and on your mobile device.",
    laano_label:"App · Free Forever",
    laano_tagline:"Someone is always <em>here to listen.</em>",
    laano_desc:"LàNo is an AI companion for moments when you need to be heard. no judgment, no rush, no cost. Because being listened to at the right moment can change everything.",
    laano_why:"Why LàNo?",
    laano_name_story:"「Là」is one of the most common words in Vietnamese. it means <em>to be, to exist.</em> 「No」(の) is one of the most common particles in Japanese. it means <em>belonging, connection.</em> Together: <strong>I exist, and I belong somewhere that listens.</strong>",
    you_label:"You",
    chat_user_1:"I don't know why, but today just feels really heavy.",
    chat_ai_1:"I hear you. Heavy days are real. you don't have to explain why. I'm here. Do you want to talk about what's on your mind, or just sit with it for a moment?",
    chat_user_2:"I just want someone to listen, I think.",
    chat_ai_2:"Then I'm listening. Take all the time you need. 🌿",
    feat1_title:"Always present", feat1_desc:"Available 24/7, because difficult moments don't follow a schedule.",
    feat2_title:"Private & secure", feat2_desc:"Your conversations are yours. Privacy is not a feature. It's the foundation.",
    feat3_title:"For everyone", feat3_desc:"Free, forever. Because emotional support should never have a price tag.",
    notify_title:"Be the first to know when LàNo launches.", notify_btn:"Notify me",
    email_placeholder:"your@email.com",
    msg_title:"",
    msg_desc:"Drop your feedback here. We read everything but we don't reply.",
    msg_d1:"We read every message.", msg_d2:"Your data is never shared or sold.", msg_d3:"No replies. But nothing is ignored.",
    form_name:"Your Name", form_name_ph:"e.g. Jane Smith",
    form_email:"Email", form_email_ph:"you@email.com",
    form_subject:"Subject", form_subject_ph:"What's this about?",
    form_message:"Message", form_msg_ph:"Write your message here…",
    form_send:"Send Message",
    search_placeholder:"Search anything…", search_hint:"Try: Tools · Learn · Read · Apps",
    whats_new:"What's new", nothing_yet:"Nothing yet. Check back soon.",
    tools_available:"Available now",
    tools_more_coming:"More tools coming soon",
    tools_coming_desc:"We're building more tools. Check back soon.",
    tools_free_forever:"Free forever",
    cb_tagline:"Private messaging, group chat, file sharing - using your Querencia account. No ads, no tracking.",
    cb_open:"Open Cùi Bắp →",
    cb_download_apk:"Download APK",
    cb_feat_chat:"Chat & groups",
    cb_feat_file:"File sharing",
    cb_feat_delete:"Auto-delete after 7 days",
    cb_feat_secure:"Secure",
    cb_new_chat:"✏️ New message",
    cb_new_group:"Create group",
    cb_start_conv:"Start a conversation",
    cb_select_conv:"Select a conversation",
    cb_or_new:"or start a new one",
    cb_type_msg:"Message…",
    lano_coming_desc:"An AI companion for moments when you need to be heard. No judgment, no rush.",
    lano_feat_private:"Private",
    lano_feat_nonjudge:"Non-judgmental",
    lano_feat_always:"Always on",
    lano_feat_free:"Free",
    learn_coming_desc:"Learning content is being built. Check back soon.",
    read_coming_desc:"Reading content is being curated. Check back soon.",
    nope_coming_desc:"A community for sharing experiences. Coming soon.",
    coming_soon_badge:"Coming soon",
    cancel:"Cancel",
    cb_new_group:"Create group",
    cb_create_group:"Create group",
  },
  vi: {
    slogan:"Tech and more", tagline:"Tech and more",
    nav_login:"Đăng nhập", nav_account:"Tài khoản", nav_register:"Đăng ký", nav_logout:"Đăng xuất", menu_faq:"Câu hỏi thường gặp", auth_forgot:"Quên mật khẩu?", auth_forgot_title:"Quên mật khẩu", auth_back_login:"← Quay lại đăng nhập", auth_send_reset:"Gửi link đặt lại mật khẩu", auth_login_title:"Đăng nhập", auth_register_title:"Tạo tài khoản", auth_no_account:"Chưa có tài khoản?", auth_has_account:"Đã có tài khoản?", auth_given_name:"Tên", auth_given_name_ph:"VD: Văn A", auth_last_name:"Họ", auth_last_name_ph:"VD: Nguyễn", auth_confirm_password:"Xác nhận mật khẩu", auth_password:"Mật khẩu", auth_create:"Tạo tài khoản", auth_login:"Đăng nhập", auth_register:"Đăng ký", auth_name:"Tên",
    hero_quote:"Không phải thế giới quá tối, mà vì có lúc ta đã quen sống mà không thắp sáng chính mình.", nav_home:"Trang chủ", nav_tools:"Công cụ", nav_learn:"Học", nav_read:"Đọc", nav_message:"Nhắn tin", nav_cuibap:"Cùi Bắp",
    home_eyebrow:"Nơi để trở về",
    home_h1:"Nơi ý tưởng lớn lên thành <em>công cụ có giá trị</em>",
    home_sub:"Querencia tạo ra những công cụ chu đáo cho những tâm trí tò mò. ưu tiên quyền riêng tư, được chế tác đẹp, và được xây dựng để tồn tại lâu dài.",
    home_cta1:"Khám phá Công cụ", home_cta2:"Đọc thêm",
    home_card_tools:"Những công cụ được thiết kế cẩn thận để giúp bạn suy nghĩ, sáng tạo và làm việc tốt hơn. Có gói miễn phí và Pro.",
    home_card_tools_arrow:"Khám phá Công cụ →",
    home_card_learn:"Tài nguyên có cấu trúc, hướng dẫn và bài học cho những ai muốn đi sâu hơn vào những điều quan trọng.",
    home_card_learn_arrow:"Bắt đầu Học →",
    home_card_read:"Bài luận, ý tưởng và suy ngẫm về công nghệ, nghề thủ công và xây dựng những thứ đáng xây dựng.",
    home_card_read_arrow:"Bắt đầu Đọc →",
    home_note:"Được xây dựng bởi một người, dành cho tất cả. <span>querencia.com.vn</span>",
    footer_copy:"© 2026 Querencia · Bảo lưu mọi quyền", footer_links:"Quyền riêng tư · Bảo mật · Điều khoản", footer_tagline:"Querencia không có quảng cáo và không bao giờ bán dữ liệu của bạn. Nền tảng được duy trì hoàn toàn nhờ các công cụ trả phí.",
    tools_title:"",
    tools_desc:"Mỗi công cụ ở đây được xây dựng với sự cẩn thận. gọn gàng, nhanh và tôn trọng quyền riêng tư. Chọn gói phù hợp với bạn.",
    badge_free:"Miễn phí", coming_soon:"Sắp ra mắt",
    tool1_name:"Công cụ 1", tool1_desc:"Chỗ giữ chỗ cho công cụ đầu tiên. Không gian này được dành riêng cho điều gì đó tuyệt vời.",
    tool2_name:"Công cụ 2", tool2_desc:"Tính năng nâng cao cho người dùng cần nhiều sức mạnh và linh hoạt hơn.",
    tool3_name:"Công cụ 3", tool3_desc:"Một công cụ chu đáo khác đang được chế tác với ý định rõ ràng.",
    plan_free:"Miễn phí", plan_free_period:"/ mãi mãi", plan_free_desc:"Tất cả những điều cơ bản. Không quảng cáo, không theo dõi. mãi mãi.",
    free_f1:"Truy cập tất cả công cụ miễn phí", free_f2:"Giới hạn sử dụng tiêu chuẩn", free_f3:"Hỗ trợ cộng đồng",
    plan_pro_desc:"Giới hạn mở rộng, tính năng ưu tiên và quyền truy cập đầy đủ.",
    pro_f1:"Sử dụng công cụ không giới hạn", pro_f2:"Truy cập sớm các công cụ mới", pro_f3:"Hỗ trợ ưu tiên", pro_f4:"Đồng bộ đa nền tảng",
    plan_team:"Nhóm", plan_team_desc:"Dành cho các nhóm và tổ chức cần nhiều hơn.",
    team_f1:"Tất cả trong Pro", team_f2:"Tính năng cộng tác nhóm", team_f3:"Kiểm soát quản trị", team_f4:"Tích hợp tùy chỉnh",
    learn_title:"", learn_desc:"",
    learn_soon_title:"Nội dung đang được xây dựng", learn_soon_desc:"Phần này đang được xây dựng cẩn thận. Hãy quay lại sớm để xem các khóa học và tài nguyên học tập.",
    read_title:"", read_desc:"Bài luận dài và suy nghĩ về việc xây dựng, công nghệ, và nghệ thuật tạo ra những thứ tồn tại lâu dài.",
    read_soon_title:"Bài viết đầu tiên sắp ra mắt", read_soon_desc:"Viết tốt cần thời gian. Bài viết đầu tiên sẽ xứng đáng với sự chờ đợi.",
    app_label:"Ứng dụng", app_desc:"Trải nghiệm ứng dụng. có thể dùng trực tiếp trên trình duyệt và trên điện thoại.",
    app_wip:"Ứng dụng đang được phát triển. Sẽ có mặt tại đây và trên thiết bị di động của bạn.",
    laano_label:"Ứng dụng · Miễn phí mãi mãi",
    laano_tagline:"Luôn có ai đó <em>lắng nghe bạn.</em>",
    laano_desc:"LàNo là người bạn AI cho những lúc bạn cần được lắng nghe. không phán xét, không vội vàng, không tốn tiền. Vì được lắng nghe đúng lúc có thể thay đổi tất cả.",
    laano_why:"Tại sao LàNo?",
    laano_name_story:"「Là」là một trong những từ phổ biến nhất trong tiếng Việt. mang nghĩa <em>tồn tại, hiện diện.</em> 「No」(の) là trợ từ phổ biến nhất trong tiếng Nhật. mang nghĩa <em>thuộc về, kết nối.</em> Ghép lại: <strong>Tôi tồn tại, và tôi thuộc về một nơi có người lắng nghe.</strong>",
    you_label:"Bạn",
    chat_user_1:"Không biết tại sao, nhưng hôm nay cảm thấy nặng nề lắm.",
    chat_ai_1:"Mình hiểu bạn. Những ngày nặng nề như vậy là có thật. bạn không cần phải giải thích lý do. Mình ở đây. Bạn muốn kể cho mình nghe không?",
    chat_user_2:"Mình chỉ muốn có người lắng nghe thôi.",
    chat_ai_2:"Thì mình đang lắng nghe đây. Cứ từ từ nhé. 🌿",
    feat1_title:"Luôn hiện diện", feat1_desc:"Có mặt 24/7. vì những khoảnh khắc khó khăn không chọn giờ giấc.",
    feat2_title:"Riêng tư & bảo mật", feat2_desc:"Cuộc trò chuyện của bạn là của bạn. Quyền riêng tư không phải tính năng. đó là nền tảng.",
    feat3_title:"Dành cho tất cả", feat3_desc:"Miễn phí, mãi mãi. Vì hỗ trợ cảm xúc không bao giờ nên có giá.",
    notify_title:"Đăng ký để biết khi LàNo ra mắt.", notify_btn:"Thông báo cho tôi",
    email_placeholder:"email@của.bạn",
    msg_title:"",
    msg_desc:"Góp ý, phàn nàn, nhờ hỗ trợ. Gửi vào đây. Chúng tôi đọc tất cả nhưng không phản hồi lại.",
    msg_d1:"Chúng tôi đọc mọi tin nhắn.", msg_d2:"Dữ liệu của bạn không bao giờ bị chia sẻ hay bán.", msg_d3:"Không phản hồi. Nhưng không bỏ qua.",
    form_name:"Tên của bạn", form_name_ph:"VD: Nguyễn Văn A",
    form_email:"Email", form_email_ph:"ban@email.com",
    form_subject:"Chủ đề", form_subject_ph:"Bạn muốn nói về điều gì?",
    form_message:"Tin nhắn", form_msg_ph:"Viết tin nhắn của bạn ở đây…",
    form_send:"Gửi tin nhắn",
    search_placeholder:"Tìm kiếm bất cứ điều gì…", search_hint:"Thử: Công cụ · Học · Đọc · Ứng dụng",
    whats_new:"Có gì mới", nothing_yet:"Chưa có gì. Hãy ghé lại sau.",
    tools_available:"Có thể dùng ngay",
    tools_more_coming:"Nhiều tool khác sắp ra mắt",
    tools_coming_desc:"Chúng mình đang xây dựng thêm nhiều công cụ mới. Quay lại sớm nhé.",
    tools_free_forever:"Miễn phí mãi mãi",
    cb_tagline:"Nhắn tin riêng tư, nhóm chat, chia sẻ file - dùng chung tài khoản Querencia. Không quảng cáo, không theo dõi.",
    cb_open:"Mở Cùi Bắp →",
    cb_download_apk:"Tải APK Android",
    cb_feat_chat:"Chat & nhóm",
    cb_feat_file:"Chia sẻ file",
    cb_feat_delete:"Tự xóa sau 7 ngày",
    cb_feat_secure:"Bảo mật",
    cb_new_chat:"✏️ Nhắn tin mới",
    cb_new_group:"Tạo nhóm",
    cb_start_conv:"Bắt đầu trò chuyện",
    cb_select_conv:"Chọn một cuộc trò chuyện",
    cb_or_new:"hoặc bắt đầu cuộc trò chuyện mới",
    cb_type_msg:"Nhắn tin…",
    lano_coming_desc:"Người bạn AI cho những lúc bạn cần được lắng nghe. Không phán xét, không vội vàng.",
    lano_feat_private:"Riêng tư",
    lano_feat_nonjudge:"Không phán xét",
    lano_feat_always:"Mọi lúc",
    lano_feat_free:"Miễn phí",
    learn_coming_desc:"Nội dung học tập đang được xây dựng. Quay lại sớm nhé.",
    read_coming_desc:"Nội dung đọc đang được biên soạn. Quay lại sớm nhé.",
    nope_coming_desc:"Cộng đồng chia sẻ kinh nghiệm đang được xây dựng. Sắp ra mắt.",
    coming_soon_badge:"Sắp ra mắt",
    cancel:"Hủy",
    cb_new_group:"Tạo nhóm mới",
    cb_create_group:"Tạo nhóm",
  },
  ja: {
    slogan:"Tech and more", tagline:"Tech and more",
    nav_login:"ログイン", nav_account:"アカウント", nav_register:"登録", nav_logout:"ログアウト", menu_faq:"よくある質問", auth_forgot:"パスワードを忘れた方", auth_forgot_title:"パスワードをリセット", auth_back_login:"← ログインに戻る", auth_send_reset:"リセットリンクを送る", auth_login_title:"ログイン", auth_register_title:"アカウント作成", auth_no_account:"アカウントをお持ちでないですか？", auth_has_account:"すでにアカウントをお持ちですか？", auth_given_name:"名", auth_given_name_ph:"例：太郎", auth_last_name:"姓", auth_last_name_ph:"例：山田", auth_confirm_password:"パスワード確認", auth_password:"パスワード", auth_create:"アカウント作成", auth_login:"ログイン", auth_register:"登録", auth_name:"お名前",
    hero_quote:"世界が暗すぎるのではなく、自分自身を照らすことなく生きることに慣れてしまっただけだ。", nav_home:"ホーム", nav_tools:"ツール", nav_learn:"学ぶ", nav_read:"読む", nav_message:"メッセージ", nav_cuibap:"Cùi Bắp",
    home_eyebrow:"帰ってくる場所",
    home_h1:"アイデアが<em>価値あるツール</em>へと育つ場所",
    home_sub:"Querenciaは好奇心旺盛な人々のための思いやりのあるツールを作ります. プライバシー優先、丁寧に作られ、長く続くように。",
    home_cta1:"ツールを探す", home_cta2:"もっと読む",
    home_card_tools:"思考、創造、仕事をより良くするために丁寧に設計された道具。無料とProプランがあります。",
    home_card_tools_arrow:"ツールを探す →",
    home_card_learn:"大切なことをより深く学びたい人のための構造化されたリソース、ガイド、レッスン。",
    home_card_learn_arrow:"学び始める →",
    home_card_read:"テクノロジー、クラフト、価値あるものを作ることについてのエッセイやアイデア。",
    home_card_read_arrow:"読み始める →",
    home_note:"一人によって、みんなのために作られました。<span>querencia.com.vn</span>",
    footer_copy:"© 2026 Querencia · 全著作権所有", footer_links:"プライバシー · セキュリティ · 利用規約", footer_tagline:"Querenciaは広告を表示せず、ユーザーデータを決して販売しません。運営は有料ツールの収益のみで支えられています。",
    tools_title:"",
    tools_desc:"ここのツールはすべて丁寧に作られています. クリーンで速く、プライバシーを尊重。あなたに合ったプランを選んでください。",
    badge_free:"無料", coming_soon:"近日公開",
    tool1_name:"ツール1", tool1_desc:"最初のツールのプレースホルダー。このスペースは素晴らしいものために予約されています。",
    tool2_name:"ツール2", tool2_desc:"より多くのパワーと柔軟性を必要とするユーザーのための高度な機能。",
    tool3_name:"ツール3", tool3_desc:"意図を持って作られているもう一つの思いやりのある道具。",
    plan_free:"無料", plan_free_period:"/ 永遠に", plan_free_desc:"すべての基本。広告なし、追跡なし. 永遠に。",
    free_f1:"すべての無料ツールへのアクセス", free_f2:"標準使用制限", free_f3:"コミュニティサポート",
    plan_pro_desc:"拡張された制限、優先機能、フルアクセス。",
    pro_f1:"無制限のツール使用", pro_f2:"新ツールへの早期アクセス", pro_f3:"優先サポート", pro_f4:"クロスプラットフォーム同期",
    plan_team:"チーム", plan_team_desc:"より多くを必要とするグループや組織向け。",
    team_f1:"Proのすべて", team_f2:"チームコラボレーション機能", team_f3:"管理者コントロール", team_f4:"カスタム統合",
    learn_title:"", learn_desc:"",
    learn_soon_title:"コンテンツ作成中", learn_soon_desc:"このセクションは丁寧に構築中です。コースと学習リソースをお待ちください。",
    read_title:"", read_desc:"構築、テクノロジー、長続きするものを作る芸術についての長文エッセイ。",
    read_soon_title:"最初の投稿は近日公開", read_soon_desc:"良い文章には時間がかかります。最初の作品は待つ価値があります。",
    app_label:"アプリ", app_desc:"ブラウザとモバイルで利用できるアプリ体験。",
    app_wip:"このアプリは開発中です。こことあなたのモバイルデバイスで利用できるようになります。",
    laano_label:"アプリ · 永遠に無料",
    laano_tagline:"いつでも誰かが<em>ここで聞いています。</em>",
    laano_desc:"LàNoは、誰かに話を聞いてほしいときのためのAIコンパニオンです。判断なし、急かしなし、費用なし。",
    laano_why:"なぜLàNo？",
    laano_name_story:"「Là」はベトナム語で最も多く使われる言葉のひとつ. <em>存在する、あること</em>を意味します。「No」(の)は日本語で最も多く使われる助詞. <em>属すること、つながり</em>を意味します。合わせると: <strong>私は存在し、耳を傾けてくれる場所に属している。</strong>",
    you_label:"あなた",
    chat_user_1:"なぜかわからないけど、今日はとても重い気分です。",
    chat_ai_1:"気持ち、わかります。重い日というのは本当にあります。理由を説明しなくていいです。ここにいますよ。気持ちを話したいですか？",
    chat_user_2:"ただ、誰かに聞いてほしいだけだと思います。",
    chat_ai_2:"では、聞いています。ゆっくりどうぞ。🌿",
    feat1_title:"いつでも存在", feat1_desc:"24時間365日対応. 辛い瞬間はスケジュールを選ばないから。",
    feat2_title:"プライベート＆安全", feat2_desc:"会話はあなたのもの。プライバシーは機能ではなく、基盤です。",
    feat3_title:"すべての人へ", feat3_desc:"永遠に無料。感情的なサポートに値段はつけられないから。",
    notify_title:"LàNoのローンチ情報をいち早く受け取る。", notify_btn:"通知を受け取る",
    email_placeholder:"あなた@メール.com",
    msg_title:"",
    msg_desc:"フィードバック、苦情、サポートのリクエスト。ここに送ってください。すべて読みますが、返信はしません。",
    msg_d1:"すべてのメッセージを読んでいます。", msg_d2:"あなたのデータは共有または販売されません。", msg_d3:"返信はしません。でも無視もしません。",
    form_name:"お名前", form_name_ph:"例：山田太郎",
    form_email:"メール", form_email_ph:"あなた@email.com",
    form_subject:"件名", form_subject_ph:"何についてですか？",
    form_message:"メッセージ", form_msg_ph:"メッセージをここに書いてください…",
    form_send:"メッセージを送る",
    search_placeholder:"何でも検索…", search_hint:"試してみて: ツール · 学ぶ · 読む · アプリ",
    whats_new:"新着情報", nothing_yet:"まだありません。またチェックしてください。",
    tools_available:"今すぐ使える",
    tools_more_coming:"もっと多くのツールが近日公開",
    tools_coming_desc:"新しいツールを作っています。またチェックしてください。",
    tools_free_forever:"永久無料",
    cb_tagline:"プライベートメッセージ、グループチャット、ファイル共有 - Querenciaアカウントで。広告なし、追跡なし。",
    cb_open:"Cùi Bắpを開く →",
    cb_download_apk:"APKをダウンロード",
    cb_feat_chat:"チャット＆グループ",
    cb_feat_file:"ファイル共有",
    cb_feat_delete:"7日後に自動削除",
    cb_feat_secure:"セキュア",
    cb_new_chat:"✏️ 新しいメッセージ",
    cb_new_group:"グループ作成",
    cb_start_conv:"会話を始める",
    cb_select_conv:"会話を選択",
    cb_or_new:"または新しい会話を始める",
    cb_type_msg:"メッセージ…",
    lano_coming_desc:"聞いてほしい瞬間のためのAIコンパニオン。判断なし、焦りなし。",
    lano_feat_private:"プライベート",
    lano_feat_nonjudge:"判断なし",
    lano_feat_always:"いつでも",
    lano_feat_free:"無料",
    learn_coming_desc:"学習コンテンツを作成中です。またチェックしてください。",
    read_coming_desc:"読書コンテンツを準備中です。またチェックしてください。",
    nope_coming_desc:"経験共有コミュニティ。近日公開。",
    coming_soon_badge:"近日公開",
    cancel:"キャンセル",
    cb_new_group:"グループ作成",
    cb_create_group:"グループ作成",
  },
  es: {
    slogan:"Tech and more", tagline:"Tech and more",
    nav_login:"Iniciar sesión", nav_account:"Cuenta", nav_register:"Registrarse", nav_logout:"Cerrar sesión", menu_faq:"Preguntas frecuentes", auth_forgot:"¿Olvidaste tu contraseña?", auth_forgot_title:"Olvidé mi contraseña", auth_back_login:"← Volver a iniciar sesión", auth_send_reset:"Enviar enlace de restablecimiento", auth_login_title:"Iniciar sesión", auth_register_title:"Crear cuenta", auth_no_account:"¿No tienes cuenta?", auth_has_account:"¿Ya tienes cuenta?", auth_given_name:"Nombre", auth_given_name_ph:"ej. Juan", auth_last_name:"Apellido", auth_last_name_ph:"ej. García", auth_confirm_password:"Confirmar contraseña", auth_password:"Contraseña", auth_create:"Crear cuenta", auth_login:"Iniciar sesión", auth_register:"Registrarse", auth_name:"Nombre",
    hero_quote:"No es que el mundo sea demasiado oscuro, sino que nos hemos acostumbrado a vivir sin iluminarnos a nosotros mismos.", nav_home:"Inicio", nav_tools:"Herramientas", nav_learn:"Aprender", nav_read:"Leer", nav_message:"Mensaje", nav_cuibap:"Cùi Bắp",
    home_eyebrow:"Un lugar al que volver",
    home_h1:"Donde las ideas crecen hasta convertirse en <em>herramientas que importan</em>",
    home_sub:"Querencia construye herramientas reflexivas para mentes curiosas. privacidad primero, bellamente elaboradas y construidas para durar.",
    home_cta1:"Explorar Herramientas", home_cta2:"Leer más",
    home_card_tools:"Instrumentos cuidadosamente diseñados para ayudarte a pensar, crear y trabajar mejor. Planes gratuitos y Pro disponibles.",
    home_card_tools_arrow:"Explorar Herramientas →",
    home_card_learn:"Recursos estructurados, guías y lecciones para quienes quieren profundizar en lo que importa.",
    home_card_learn_arrow:"Empezar a Aprender →",
    home_card_read:"Ensayos, ideas y reflexiones sobre tecnología, artesanía y construir cosas que valen la pena.",
    home_card_read_arrow:"Empezar a Leer →",
    home_note:"Construido por una persona, para todos. <span>querencia.com.vn</span>",
    footer_copy:"© 2026 Querencia · Todos los derechos reservados", footer_links:"Privacidad · Seguridad · Términos", footer_tagline:"Querencia no muestra anuncios y nunca vende tus datos. Nos financiamos exclusivamente con nuestras herramientas de pago.",
    tools_title:"",
    tools_desc:"Cada herramienta aquí está construida con cuidado. limpia, rápida y respetuosa de la privacidad. Elige el plan que te convenga.",
    badge_free:"Gratis", coming_soon:"Próximamente",
    tool1_name:"Herramienta 1", tool1_desc:"Un marcador de posición para la primera herramienta. Este espacio está reservado para algo grandioso.",
    tool2_name:"Herramienta 2", tool2_desc:"Funciones avanzadas para usuarios que necesitan más potencia y flexibilidad.",
    tool3_name:"Herramienta 3", tool3_desc:"Otro instrumento reflexivo que se está elaborando con intención.",
    plan_free:"Gratis", plan_free_period:"/ para siempre", plan_free_desc:"Todo lo esencial. Sin anuncios, sin seguimiento. nunca.",
    free_f1:"Acceso a todas las herramientas gratuitas", free_f2:"Límites de uso estándar", free_f3:"Soporte de la comunidad",
    plan_pro_desc:"Límites extendidos, funciones prioritarias y acceso completo.",
    pro_f1:"Uso ilimitado de herramientas", pro_f2:"Acceso anticipado a nuevas herramientas", pro_f3:"Soporte prioritario", pro_f4:"Sincronización multiplataforma",
    plan_team:"Equipo", plan_team_desc:"Para grupos y organizaciones que necesitan más.",
    team_f1:"Todo en Pro", team_f2:"Funciones de colaboración en equipo", team_f3:"Controles de administrador", team_f4:"Integraciones personalizadas",
    learn_title:"", learn_desc:"",
    learn_soon_title:"Contenido en progreso", learn_soon_desc:"Esta sección se está construyendo cuidadosamente. Vuelve pronto para ver cursos y recursos de aprendizaje.",
    read_title:"", read_desc:"Ensayos largos y pensamientos sobre construir, tecnología y el arte de hacer cosas que duran.",
    read_soon_title:"Primera publicación próximamente", read_soon_desc:"Escribir bien lleva tiempo. La primera pieza valdrá la espera.",
    app_label:"App", app_desc:"Una experiencia de app. disponible directamente en tu navegador y en móvil.",
    app_wip:"Esta app está en desarrollo. Estará disponible aquí y en tu dispositivo móvil.",
    laano_label:"App · Siempre gratis",
    laano_tagline:"Siempre hay alguien <em>aquí para escucharte.</em>",
    laano_desc:"LàNo es un compañero de IA para los momentos en que necesitas ser escuchado. sin juicios, sin prisas, sin costo.",
    laano_why:"¿Por qué LàNo?",
    laano_name_story:"「Là」es una de las palabras más comunes en vietnamita. significa <em>ser, existir.</em> 「No」(の) es una de las partículas más comunes en japonés. significa <em>pertenencia, conexión.</em> Juntas: <strong>Existo, y pertenezco a un lugar que escucha.</strong>",
    you_label:"Tú",
    chat_user_1:"No sé por qué, pero hoy todo se siente muy pesado.",
    chat_ai_1:"Te escucho. Los días pesados son reales. no tienes que explicar por qué. Estoy aquí. ¿Quieres hablar sobre lo que tienes en mente?",
    chat_user_2:"Creo que solo quiero que alguien me escuche.",
    chat_ai_2:"Entonces estoy escuchando. Tómate todo el tiempo que necesites. 🌿",
    feat1_title:"Siempre presente", feat1_desc:"Disponible 24/7. porque los momentos difíciles no siguen un horario.",
    feat2_title:"Privado y seguro", feat2_desc:"Tus conversaciones son tuyas. La privacidad no es una función. es la base.",
    feat3_title:"Para todos", feat3_desc:"Gratis, para siempre. Porque el apoyo emocional nunca debería tener precio.",
    notify_title:"Sé el primero en saber cuando LàNo se lance.", notify_btn:"Notifícame",
    email_placeholder:"tu@email.com",
    msg_title:"",
    msg_desc:"Comentarios, quejas, solicitudes de soporte. déjalos aquí. Leemos todo, pero no respondemos.",
    msg_d1:"Leemos cada mensaje.", msg_d2:"Tus datos nunca se comparten ni se venden.", msg_d3:"Sin respuestas. Pero nada se ignora.",
    form_name:"Tu Nombre", form_name_ph:"ej. Juan García",
    form_email:"Email", form_email_ph:"tu@email.com",
    form_subject:"Asunto", form_subject_ph:"¿De qué se trata?",
    form_message:"Mensaje", form_msg_ph:"Escribe tu mensaje aquí…",
    form_send:"Enviar Mensaje",
    search_placeholder:"Buscar cualquier cosa…", search_hint:"Prueba: Herramientas · Aprender · Leer · Apps",
    whats_new:"Novedades", nothing_yet:"Nada aún. Vuelve pronto.",
    tools_available:"Disponible ahora",
    tools_more_coming:"Más herramientas próximamente",
    tools_coming_desc:"Estamos construyendo más herramientas. Vuelve pronto.",
    tools_free_forever:"Gratis para siempre",
    cb_tagline:"Mensajería privada, chat grupal, compartir archivos - con tu cuenta Querencia. Sin anuncios, sin rastreo.",
    cb_open:"Abrir Cùi Bắp →",
    cb_download_apk:"Descargar APK",
    cb_feat_chat:"Chat y grupos",
    cb_feat_file:"Compartir archivos",
    cb_feat_delete:"Auto-eliminar después de 7 días",
    cb_feat_secure:"Seguro",
    cb_new_chat:"✏️ Nuevo mensaje",
    cb_new_group:"Crear grupo",
    cb_start_conv:"Iniciar una conversación",
    cb_select_conv:"Seleccionar una conversación",
    cb_or_new:"o iniciar una nueva",
    cb_type_msg:"Mensaje…",
    lano_coming_desc:"Un compañero de IA para momentos en que necesitas ser escuchado. Sin juicios, sin prisas.",
    lano_feat_private:"Privado",
    lano_feat_nonjudge:"Sin juicios",
    lano_feat_always:"Siempre disponible",
    lano_feat_free:"Gratis",
    learn_coming_desc:"El contenido de aprendizaje está siendo creado. Vuelve pronto.",
    read_coming_desc:"El contenido de lectura está siendo preparado. Vuelve pronto.",
    nope_coming_desc:"Una comunidad para compartir experiencias. Próximamente.",
    coming_soon_badge:"Próximamente",
    cancel:"Cancelar",
    cb_new_group:"Crear grupo",
    cb_create_group:"Crear grupo",
  }
};

// ── BIẾN NGÔN NGỮ HIỆN TẠI ─────────────────────────────────
let currentLang = 'en';

// ── HÀM CHUYỂN NGÔN NGỮ ────────────────────────────────────
function toggleLangDropdown() {
  document.getElementById('langSwitcher').classList.toggle('open');
}

function setLang(lang) {
  currentLang = lang;
  const labels = {en:'EN', vi:'VI', ja:'日本', es:'ES'};
  document.getElementById('langCurrentLabel').textContent = labels[lang];
  document.querySelectorAll('.lang-option').forEach(b => b.classList.remove('active'));
  document.getElementById('lang-' + lang).classList.add('active');
  document.getElementById('langSwitcher').classList.remove('open');
  const t = T[lang];
  // Thay nội dung văn bản
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });
  // Thay placeholder của input
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.placeholder = t[key];
  });
  // Giữ icon người trên nav - không đổi text khi chưa đăng nhập
  // (icon được set bởi auth.js, không dùng data-i18n)
  const navBtn = document.getElementById('navAuthBtn');
  if (navBtn && !authToken) {
    // Chỉ set lại icon nếu bị mất (không có SVG bên trong)
    if (!navBtn.querySelector('svg')) {
      navBtn.innerHTML = typeof AUTH_ICON !== 'undefined' ? AUTH_ICON :
        `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg><span class="auth-chevron">▼</span>`;
    }
  }
  // Lưu ngôn ngữ vào localStorage
  localStorage.setItem('lang', lang);
}

// ── ÁP DỤNG DỊCH CHO NỘI DUNG MỚI LOAD ─────────────────────
function applyTranslations() {
  setLang(currentLang);
}

// ── KHÔI PHỤC NGÔN NGỮ TỪ LOCALSTORAGE KHI LOAD ────────────
(function() {
  const saved = localStorage.getItem('lang');
  if (saved && T[saved] && saved !== 'en') {
    setTimeout(() => setLang(saved), 50);
  }
})();

// ============================================================
// PHẦN 2: ĐIỀU HƯỚNG (NAVIGATION)
// ============================================================
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-links a[data-section]').forEach(a => a.classList.remove('active'));
  const sec = document.getElementById(id);
  if (sec) { sec.classList.add('active'); window.scrollTo(0,0); }
  const link = document.querySelector(`.nav-links a[data-section="${id}"]`);
  if (link && !link.classList.contains('tools-link')) link.classList.add('active');
  // Ẩn/hiện form message theo trạng thái đăng nhập
  if (id === 'message') {
    const gate = document.getElementById('msgLoginGate');
    const form = document.getElementById('msgForm');
    if (gate && form) {
      gate.style.display = authToken ? 'none' : 'block';
      form.style.display = authToken ? 'block' : 'none';
    }
  }
  // Khởi động Cùi Bắp khi vào section
  if (id === 'cuibap') {
    if (typeof cbInit === 'function') cbInit();
  }
}

// ============================================================
// PHẦN 3: DARK MODE
// ============================================================
function toggleDark() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark');

// ============================================================
// PHẦN 4: LOADING SCREEN
// ============================================================
window.addEventListener('load', () => {
  const loader = document.getElementById('loadingScreen');
  if (loader) { loader.style.opacity = '0'; setTimeout(() => loader.style.display = 'none', 400); }
});
