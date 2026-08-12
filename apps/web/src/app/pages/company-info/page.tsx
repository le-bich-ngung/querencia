import type { Metadata } from 'next';
import {
  LegalPage, H2, H3, P, UL, LI, HR, Table, Th, Td, Disclaimer, Strong, A, Code,
} from '../../../components/legal/LegalDoc';

export const metadata: Metadata = {
  title: 'Company Info - Querencia',
  robots: { index: false, follow: false }, // hidden until legal entity registration is finalized
};

export default function CompanyInfoPage() {
  return (
    <LegalPage title="Company Info" lastUpdated="[DATE]">
      <P>
        Querencia is a real, registered company - not just an app made by an anonymous team.
        This page is where you can verify that for yourself.
      </P>

      <H2>Key facts</H2>
      <Table>
        <thead><tr><Th>Field</Th><Th>Value</Th></tr></thead>
        <tbody>
          <tr><Td>Legal name (Vietnamese)</Td><Td>{"CÔNG TY TRÁCH NHIỆM HỮU HẠN MỘT THÀNH VIÊN QUERENCIA"}</Td></tr>
          <tr><Td>Legal name (English)</Td><Td>{"QUERENCIA ONE MEMBER COMPANY LIMITED"}</Td></tr>
          <tr><Td>Entity type</Td><Td>Single-member Limited Liability Company, registered in Vietnam</Td></tr>
          <tr><Td>Headquarters</Td><Td>Cần Thơ, Vietnam</Td></tr>
          <tr><Td>Charter capital</Td><Td>30,000,000 VND</Td></tr>
          <tr><Td>Legal representative</Td><Td>Lê Bích Ngưng</Td></tr>
          <tr><Td>Business registration number</Td><Td>[DATE OF FILING] - number to be added once registration is complete</Td></tr>
          <tr><Td>Main business lines</Td><Td>Computer programming, software publishing, data processing, web portals, IT consulting, R&D</Td></tr>
        </tbody>
      </Table>

      <Disclaimer>
        You can independently verify our business registration on Vietnam's National Business
        Registration Portal at{' '}
        <A href="https://dangkykinhdoanh.gov.vn">dangkykinhdoanh.gov.vn</A>
        {' '}using the business registration number above. This is the most reliable way to confirm
        we are who we say we are - please don't rely on this page alone.
      </Disclaimer>

      <HR/>

      <H2>Company Charter and internal regulations</H2>
      <P>
        Below are the full text of our Company Charter (Điều lệ công ty) and our Data, Technology,
        and Digital Assets Governance Regulations (Quy chế Quản trị Công nghệ, Dữ liệu và Tài sản số) -
        the internal documents that govern how Querencia is run, including our commitments around
        data governance, security, and AI.
      </P>
      <P>
        <Strong>The Vietnamese text below is the sole legally binding version.</Strong>{' '}
        We have not translated it in full, both because Vietnamese legal terminology does not
        always map precisely onto English, and because our Company Charter itself designates the
        Vietnamese original as authoritative (Điều 125). Translating the full text risks creating
        a misleading impression of precision we can't guarantee. If you need a certified translation
        for an official purpose, please contact us.
      </P>

      <H3 style={{ color: "var(--text)", fontStyle: "normal" }}>Company Charter - Table of Contents</H3>
      <UL>
<li><A href="#dieu-le-chuong-1">{"CHƯƠNG I. QUY ĐỊNH CHUNG"}</A></li>
      <li><A href="#dieu-le-chuong-2">{"CHƯƠNG II. TÊN, MỤC TIÊU VÀ NGUYÊN TẮC HOẠT ĐỘNG"}</A></li>
      <li><A href="#dieu-le-chuong-3">{"CHƯƠNG III. NGÀNH, NGHỀ KINH DOANH"}</A></li>
      <li><A href="#dieu-le-chuong-4">{"CHƯƠNG IV. CHỦ SỞ HỮU CÔNG TY"}</A></li>
      <li><A href="#dieu-le-chuong-5">{"CHƯƠNG V. VỐN ĐIỀU LỆ"}</A></li>
      <li><A href="#dieu-le-chuong-6">{"CHƯƠNG VI. QUẢN TRỊ VÀ ĐIỀU HÀNH CÔNG TY"}</A></li>
      <li><A href="#dieu-le-chuong-7">{"CHƯƠNG VII. CÔNG NGHỆ, DỮ LIỆU VÀ TÀI SẢN SỐ"}</A></li>
      <li><A href="#dieu-le-chuong-8">{"CHƯƠNG VIII. TÀI CHÍNH VÀ KẾ TOÁN"}</A></li>
      <li><A href="#dieu-le-chuong-9">{"CHƯƠNG IX. LAO ĐỘNG"}</A></li>
      <li><A href="#dieu-le-chuong-10">{"CHƯƠNG X. KIỂM TOÁN"}</A></li>
      <li><A href="#dieu-le-chuong-11">{"CHƯƠNG XI. TUÂN THỦ PHÁP LUẬT"}</A></li>
      <li><A href="#dieu-le-chuong-12">{"CHƯƠNG XII. CHỐNG XUNG ĐỘT LỢI ÍCH"}</A></li>
      <li><A href="#dieu-le-chuong-13">{"CHƯƠNG XIII. CHỐNG THAM NHŨNG"}</A></li>
      <li><A href="#dieu-le-chuong-14">{"CHƯƠNG XIV. GIẢI QUYẾT TRANH CHẤP"}</A></li>
      <li><A href="#dieu-le-chuong-15">{"CHƯƠNG XV. ĐIỀU KHOẢN CHUYỂN TIẾP"}</A></li>
      <li><A href="#dieu-le-chuong-16">{"CHƯƠNG XVI. ĐIỀU KHOẢN THI HÀNH"}</A></li>      </UL>

      <HR/>

<H2 id="dieu-le-chuong-1">{"CHƯƠNG I. QUY ĐỊNH CHUNG"}</H2>
      <H3>{"Điều 1. Cơ sở pháp lý"}</H3>
      <P style={{marginLeft:14}}>{"1.  Điều lệ này được xây dựng và áp dụng trên cơ sở:"}</P>
      <P style={{marginLeft:28}}>{"a) Hiến pháp nước Cộng hòa xã hội chủ nghĩa Việt Nam;"}</P>
      <P style={{marginLeft:28}}>{"b) Luật Doanh nghiệp và các văn bản hướng dẫn thi hành;"}</P>
      <P style={{marginLeft:28}}>{"c) Bộ luật Dân sự và các văn bản pháp luật có liên quan;"}</P>
      <P style={{marginLeft:28}}>{"d) Pháp luật về đầu tư, kế toán, thuế, sở hữu trí tuệ, an ninh mạng, giao dịch điện tử, bảo vệ dữ liệu cá nhân, công nghiệp công nghệ số, trí tuệ nhân tạo và các lĩnh vực pháp luật chuyên ngành khác có liên quan đến hoạt động của Công ty;"}</P>
      <P style={{marginLeft:28}}>{"đ) Điều ước quốc tế mà Việt Nam là thành viên;"}</P>
      <P style={{marginLeft:28}}>{"e) Các quy định nội bộ của Công ty được ban hành phù hợp với Điều lệ này và các văn bản pháp luật có liên quan."}</P>
      <P style={{marginLeft:14}}>{"2.  Trường hợp quy định của Điều lệ này khác với quy định bắt buộc của pháp luật Việt Nam thì áp dụng quy định của pháp luật Việt Nam."}</P>
      <P style={{marginLeft:14}}>{"3.  Trường hợp pháp luật Việt Nam sửa đổi hoặc ban hành quy định mới làm cho một hoặc nhiều điều khoản của Điều lệ này không còn phù hợp thì chỉ các điều khoản đó hết hiệu lực; các điều khoản còn lại vẫn tiếp tục được áp dụng."}</P>
      <H3>{"Điều 2. Giải thích thuật ngữ"}</H3>
      <P>{"Trong Điều lệ này, các thuật ngữ dưới đây được hiểu như sau:"}</P>
      <P style={{marginLeft:14}}>{"1.  \"Công ty\" là Công ty Trách nhiệm hữu hạn một thành viên QUERENCIA."}</P>
      <P style={{marginLeft:14}}>{"2.  \"Chủ sở hữu\" là cá nhân sở hữu toàn bộ vốn điều lệ của Công ty theo quy định tại Điều 26 Điều lệ này."}</P>
      <P style={{marginLeft:14}}>{"3.  \"Người đại diện theo pháp luật\" là cá nhân được quy định tại Mục III Giấy đề nghị đăng ký doanh nghiệp và Điều 45 Điều lệ này."}</P>
      <P style={{marginLeft:14}}>{"4.  \"Vốn điều lệ\" là số vốn do Chủ sở hữu cam kết góp và được ghi nhận tại Điều 35 (Chương V) Điều lệ này."}</P>
      <P style={{marginLeft:14}}>{"5.  \"Quy chế nội bộ\" là văn bản do Chủ sở hữu hoặc Người đại diện theo pháp luật ban hành để quy định chi tiết các vấn đề vận hành cụ thể của Công ty (bao gồm nhưng không giới hạn ở quản trị dữ liệu, tài sản số, sở hữu trí tuệ, trí tuệ nhân tạo và an toàn thông tin theo Điều 56 Điều lệ này), không trái với Điều lệ này và quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"6.  \"Hệ thống AI\" (trí tuệ nhân tạo) được hiểu theo định nghĩa tại Luật Trí tuệ nhân tạo số 134/2025/QH15."}</P>
      <P style={{marginLeft:14}}>{"7.  \"Dữ liệu cá nhân\" được hiểu theo định nghĩa tại Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15."}</P>
      <P style={{marginLeft:14}}>{"8.  \"Việt Nam\" là nước Cộng hòa xã hội chủ nghĩa Việt Nam."}</P>
      <P style={{marginLeft:14}}>{"9.  Các tiêu đề (chương, điều) của Điều lệ này được sử dụng nhằm thuận tiện cho việc tra cứu và không ảnh hưởng tới nội dung của Điều lệ này."}</P>
      <H3>{"Điều 3. Phạm vi điều chỉnh"}</H3>
      <P style={{marginLeft:14}}>{"1.  Điều lệ này quy định về:"}</P>
      <P style={{marginLeft:28}}>{"a) Tổ chức và hoạt động của Công ty;"}</P>
      <P style={{marginLeft:28}}>{"b) Quyền, nghĩa vụ và trách nhiệm của Chủ sở hữu;"}</P>
      <P style={{marginLeft:28}}>{"c) Quyền, nghĩa vụ và trách nhiệm của Người đại diện theo pháp luật, Giám đốc và các chức danh quản lý khác;"}</P>
      <P style={{marginLeft:28}}>{"d) Quản trị doanh nghiệp;"}</P>
      <P style={{marginLeft:28}}>{"đ) Quản lý tài sản, tài chính và vốn;"}</P>
      <P style={{marginLeft:28}}>{"e) Quản lý tài sản số, dữ liệu, phần mềm và tài sản trí tuệ;"}</P>
      <P style={{marginLeft:28}}>{"g) Nguyên tắc quản trị công nghệ, an toàn thông tin và chuyển đổi số;"}</P>
      <P style={{marginLeft:28}}>{"h) Các vấn đề khác thuộc phạm vi hoạt động của Công ty."}</P>
      <H3>{"Điều 4. Đối tượng áp dụng"}</H3>
      <P style={{marginLeft:14}}>{"1.  Điều lệ này áp dụng đầy đủ đối với Chủ sở hữu Công ty, Người đại diện theo pháp luật, Giám đốc, các chức danh quản lý và người lao động của Công ty trong quá trình thực hiện chức năng, nhiệm vụ tại Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Đối tác, nhà thầu, cộng tác viên, tổ chức, cá nhân được Công ty ủy quyền và các bên thứ ba khác chỉ chịu sự điều chỉnh của Điều lệ này trong phạm vi mà Điều lệ này, hợp đồng đã ký kết hoặc quy chế nội bộ có liên quan quy định cụ thể việc áp dụng đối với các đối tượng này; ngoài phạm vi đó, quyền và nghĩa vụ của các đối tượng này được xác định theo hợp đồng, thỏa thuận tương ứng và quy định của pháp luật."}</P>
      <H3>{"Điều 5. Nguyên tắc hoạt động"}</H3>
      <P>{"Công ty hoạt động theo các nguyên tắc sau đây:"}</P>
      <P style={{marginLeft:14}}>{"1.  Tuân thủ Hiến pháp và pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Tôn trọng quyền con người, quyền công dân và quyền sở hữu hợp pháp."}</P>
      <P style={{marginLeft:14}}>{"3.  Hoạt động trung thực, minh bạch, hiệu quả và bền vững."}</P>
      <P style={{marginLeft:14}}>{"4.  Bảo vệ quyền và lợi ích hợp pháp của khách hàng, người lao động, đối tác và Chủ sở hữu."}</P>
      <P style={{marginLeft:14}}>{"5.  Bảo đảm an toàn thông tin, an ninh mạng và bảo vệ dữ liệu."}</P>
      <P style={{marginLeft:14}}>{"6.  Tôn trọng quyền sở hữu trí tuệ."}</P>
      <P style={{marginLeft:14}}>{"7.  Khuyến khích đổi mới sáng tạo, nghiên cứu và phát triển công nghệ."}</P>
      <P style={{marginLeft:14}}>{"8.  Quản trị doanh nghiệp theo nguyên tắc trách nhiệm giải trình, kiểm soát rủi ro và cải tiến liên tục."}</P>
      <H3>{"Điều 6. Nguyên tắc giải thích Điều lệ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Điều lệ này được giải thích theo hướng bảo đảm:"}</P>
      <P style={{marginLeft:28}}>{"a) Phù hợp với pháp luật Việt Nam;"}</P>
      <P style={{marginLeft:28}}>{"b) Bảo vệ lợi ích hợp pháp của Công ty;"}</P>
      <P style={{marginLeft:28}}>{"c) Bảo đảm tính ổn định trong quản trị;"}</P>
      <P style={{marginLeft:28}}>{"d) Khuyến khích đổi mới sáng tạo và phát triển công nghệ."}</P>
      <P style={{marginLeft:14}}>{"2.  Trường hợp một điều khoản có nhiều cách hiểu khác nhau thì ưu tiên cách hiểu:"}</P>
      <P style={{marginLeft:28}}>{"a) Không trái pháp luật;"}</P>
      <P style={{marginLeft:28}}>{"b) Bảo vệ lợi ích chung của Công ty;"}</P>
      <P style={{marginLeft:28}}>{"c) Bảo đảm tính liên tục của hoạt động kinh doanh."}</P>
      <H3>{"Điều 7. Nguyên tắc ưu tiên áp dụng"}</H3>
      <P>{"Thứ tự ưu tiên áp dụng các văn bản trong Công ty như sau:"}</P>
      <P style={{marginLeft:14}}>{"1.  Pháp luật Việt Nam."}</P>
      <P style={{marginLeft:14}}>{"2.  Điều ước quốc tế mà Việt Nam là thành viên (nếu pháp luật có quy định áp dụng)."}</P>
      <P style={{marginLeft:14}}>{"3.  Điều lệ Công ty."}</P>
      <P style={{marginLeft:14}}>{"4.  Quyết định của Chủ sở hữu."}</P>
      <P style={{marginLeft:14}}>{"5.  Quy chế quản trị."}</P>
      <P style={{marginLeft:14}}>{"6.  Quy chế chuyên môn."}</P>
      <P style={{marginLeft:14}}>{"7.  Quy trình nội bộ (SOP)."}</P>
      <P style={{marginLeft:14}}>{"8.  Hướng dẫn nghiệp vụ."}</P>
      <P style={{marginLeft:14}}>{"9.  Các văn bản quản lý khác do Công ty ban hành."}</P>
      <H3>{"Điều 8. Nguyên tắc áp dụng công nghệ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty khuyến khích việc ứng dụng công nghệ số trong mọi hoạt động quản trị và kinh doanh."}</P>
      <P style={{marginLeft:14}}>{"2.  Hồ sơ điện tử, chữ ký số, hợp đồng điện tử, dữ liệu điện tử và các giao dịch điện tử được công nhận và sử dụng theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty có quyền áp dụng các công nghệ mới nhằm nâng cao hiệu quả hoạt động, với điều kiện tuân thủ pháp luật; danh mục, tiêu chuẩn và quy trình áp dụng công nghệ cụ thể được quy định tại Quy chế nội bộ."}</P>
      <P style={{marginLeft:14}}>{"4.  Việc ứng dụng công nghệ không được làm giảm trách nhiệm pháp lý của cá nhân hoặc tổ chức có thẩm quyền theo quy định của pháp luật và Điều lệ này."}</P>
      <H3>{"Điều 9. Nguyên tắc sửa đổi Điều lệ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Điều lệ chỉ được sửa đổi theo quy định của pháp luật và quyết định của Chủ sở hữu Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Mọi sửa đổi phải được lập thành văn bản."}</P>
      <P style={{marginLeft:14}}>{"3.  Phiên bản mới của Điều lệ có hiệu lực kể từ ngày được Chủ sở hữu quyết định hoặc từ thời điểm được ghi trong quyết định sửa đổi."}</P>
      <H2 id="dieu-le-chuong-2">{"CHƯƠNG II. TÊN, MỤC TIÊU VÀ NGUYÊN TẮC HOẠT ĐỘNG"}</H2>
      <H3>{"Điều 10. Tên doanh nghiệp"}</H3>
      <P style={{marginLeft:14}}>{"1.  Tên tiếng Việt của Công ty:"}</P>
      <P><Strong>{"CÔNG TY TRÁCH NHIỆM HỮU HẠN MỘT THÀNH VIÊN QUERENCIA"}</Strong></P>
      <P style={{marginLeft:14}}>{"2.  Tên tiếng Anh:"}</P>
      <P><Strong>{"QUERENCIA ONE MEMBER COMPANY LIMITED"}</Strong></P>
      <P style={{marginLeft:14}}>{"3.  Tên viết tắt:"}</P>
      <P><Strong>{"QUERENCIA CO., LTD"}</Strong></P>
      <P style={{marginLeft:14}}>{"4.  Tên Công ty được sử dụng thống nhất trên toàn bộ hoạt động của Công ty theo quy định của pháp luật và được ghi nhận trong Giấy chứng nhận đăng ký doanh nghiệp."}</P>
      <P style={{marginLeft:14}}>{"5.  Công ty có quyền sử dụng tên thương mại, nhãn hiệu, tên miền Internet, biểu tượng, logo, dấu hiệu nhận diện thương hiệu và các tài sản nhận diện khác theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"6.  Việc thay đổi tên Công ty được thực hiện theo quy định của pháp luật và quyết định của Chủ sở hữu."}</P>
      <H3>{"Điều 11. Trụ sở, đơn vị phụ thuộc và phạm vi hoạt động"}</H3>
      <P style={{marginLeft:14}}>{"1.  Trụ sở chính của Công ty được xác định theo Giấy chứng nhận đăng ký doanh nghiệp."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty có quyền thành lập, tổ chức lại, chuyển đổi hoặc chấm dứt hoạt động của chi nhánh, văn phòng đại diện, địa điểm kinh doanh và các đơn vị phụ thuộc khác theo quy định của pháp luật hoặc theo quyết định của Chủ sở hữu."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty có quyền hoạt động trong phạm vi lãnh thổ Việt Nam và nước ngoài theo quy định của pháp luật của quốc gia nơi hoạt động và các điều ước quốc tế có liên quan."}</P>
      <P style={{marginLeft:14}}>{"4.  Công ty có quyền cung cấp sản phẩm và dịch vụ thông qua môi trường số, Internet hoặc các nền tảng công nghệ khác mà không phụ thuộc vào vị trí địa lý của khách hàng, nếu pháp luật cho phép."}</P>
      <H3>{"Điều 12. Biểu tượng, thương hiệu và tài sản nhận diện"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty có quyền xây dựng, đăng ký, sử dụng và khai thác:"}</P>
      <P style={{marginLeft:28}}>{"a) Logo;"}</P>
      <P style={{marginLeft:28}}>{"b) Nhãn hiệu;"}</P>
      <P style={{marginLeft:28}}>{"c) Tên thương mại;"}</P>
      <P style={{marginLeft:28}}>{"d) Tên miền;"}</P>
      <P style={{marginLeft:28}}>{"đ) Khẩu hiệu (Slogan);"}</P>
      <P style={{marginLeft:28}}>{"e) Giao diện nhận diện thương hiệu;"}</P>
      <P style={{marginLeft:28}}>{"g) Các tài sản nhận diện khác."}</P>
      <P style={{marginLeft:14}}>{"2.  Các tài sản nhận diện thuộc quyền sở hữu hoặc quyền sử dụng hợp pháp của Công ty được bảo vệ theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Không cá nhân nào được tự ý sử dụng hoặc chuyển giao các tài sản nhận diện của Công ty nếu chưa được người có thẩm quyền chấp thuận."}</P>
      <H3>{"Điều 13. Mục tiêu hoạt động"}</H3>
      <P style={{marginLeft:14}}>{"1.  Mục tiêu của Công ty là hoạt động kinh doanh hợp pháp nhằm tạo ra giá trị bền vững cho khách hàng, Chủ sở hữu, người lao động và xã hội."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty hướng tới việc nghiên cứu, phát triển, cung cấp và thương mại hóa các sản phẩm, dịch vụ và giải pháp công nghệ có chất lượng cao, an toàn và đáng tin cậy."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty thúc đẩy đổi mới sáng tạo, nghiên cứu khoa học và ứng dụng công nghệ nhằm nâng cao năng lực cạnh tranh và phát triển lâu dài."}</P>
      <P style={{marginLeft:14}}>{"4.  Công ty xây dựng môi trường làm việc minh bạch, chuyên nghiệp, tôn trọng đạo đức nghề nghiệp và trách nhiệm xã hội."}</P>
      <P style={{marginLeft:14}}>{"5.  Mọi hoạt động kinh doanh phải tuân thủ pháp luật, bảo đảm quyền và lợi ích hợp pháp của khách hàng, đối tác, người lao động và các bên liên quan."}</P>
      <H3>{"Điều 14. Ngành, nghề kinh doanh"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty được quyền kinh doanh các ngành, nghề đã đăng ký theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty có quyền bổ sung, thay đổi hoặc chấm dứt ngành, nghề kinh doanh theo quyết định của Chủ sở hữu và theo trình tự, thủ tục do pháp luật quy định."}</P>
      <P style={{marginLeft:14}}>{"3.  Đối với ngành, nghề kinh doanh có điều kiện, Công ty chỉ được hoạt động sau khi đáp ứng đầy đủ các điều kiện theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"4.  Việc mở rộng hoạt động sang các lĩnh vực công nghệ mới không làm thay đổi bản chất pháp lý của Công ty, miễn là phù hợp với quy định của pháp luật và ngành, nghề đã đăng ký hoặc được bổ sung hợp lệ."}</P>
      <H3>{"Điều 15. Giá trị cốt lõi"}</H3>
      <P>{"Trong quá trình hoạt động, Công ty theo đuổi các giá trị sau:"}</P>
      <P style={{marginLeft:14}}>{"1.  Tuân thủ pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Chính trực."}</P>
      <P style={{marginLeft:14}}>{"3.  Minh bạch."}</P>
      <P style={{marginLeft:14}}>{"4.  Chất lượng."}</P>
      <P style={{marginLeft:14}}>{"5.  Đổi mới sáng tạo."}</P>
      <P style={{marginLeft:14}}>{"6.  Bảo mật."}</P>
      <P style={{marginLeft:14}}>{"7.  Tôn trọng quyền riêng tư."}</P>
      <P style={{marginLeft:14}}>{"8.  Tôn trọng quyền sở hữu trí tuệ."}</P>
      <P style={{marginLeft:14}}>{"9.  Hợp tác và phát triển bền vững."}</P>
      <P>{"Các giá trị này là định hướng quản trị và không được hiểu là làm phát sinh quyền hoặc nghĩa vụ pháp lý vượt quá quy định của pháp luật và Điều lệ này."}</P>
      <H3>{"Điều 16. Nguyên tắc hoạt động"}</H3>
      <P>{"Công ty hoạt động trên các nguyên tắc sau:"}</P>
      <P style={{marginLeft:14}}>{"1.  Tuân thủ Hiến pháp, pháp luật Việt Nam, Điều lệ Công ty và các quy định nội bộ."}</P>
      <P style={{marginLeft:14}}>{"2.  Hoạt động độc lập, tự chủ, tự chịu trách nhiệm về kết quả hoạt động kinh doanh."}</P>
      <P style={{marginLeft:14}}>{"3.  Quản trị dựa trên nguyên tắc minh bạch, trách nhiệm giải trình và kiểm soát rủi ro."}</P>
      <P style={{marginLeft:14}}>{"4.  Bảo đảm an toàn thông tin, an ninh mạng và bảo vệ dữ liệu trong mọi hoạt động."}</P>
      <P style={{marginLeft:14}}>{"5.  Bảo đảm chất lượng sản phẩm và dịch vụ theo các tiêu chuẩn do Công ty ban hành hoặc cam kết với khách hàng."}</P>
      <P style={{marginLeft:14}}>{"6.  Tôn trọng và bảo vệ quyền sở hữu trí tuệ của Công ty và của bên thứ ba."}</P>
      <P style={{marginLeft:14}}>{"7.  Khuyến khích đổi mới sáng tạo, nghiên cứu khoa học, ứng dụng công nghệ mới và cải tiến liên tục."}</P>
      <P style={{marginLeft:14}}>{"8.  Cạnh tranh lành mạnh, trung thực và không thực hiện các hành vi bị pháp luật cấm."}</P>
      <P style={{marginLeft:14}}>{"9.  Quản lý và sử dụng hiệu quả tài sản, vốn, dữ liệu và các nguồn lực của Công ty."}</P>
      <P style={{marginLeft:14}}>{"10. Thực hiện đầy đủ nghĩa vụ đối với Nhà nước, khách hàng, người lao động, đối tác và các chủ thể có liên quan theo quy định của pháp luật."}</P>
      <H3>{"Điều 17. Định hướng phát triển"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty định hướng trở thành doanh nghiệp công nghệ có khả năng phát triển bền vững, ứng dụng công nghệ hiện đại và mở rộng hoạt động trong nước cũng như quốc tế."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty khuyến khích việc nghiên cứu và ứng dụng các công nghệ mới phù hợp với quy định của pháp luật và định hướng phát triển của Công ty; các lĩnh vực công nghệ ưu tiên và tiêu chuẩn kỹ thuật cụ thể được quy định tại Quy chế nội bộ."}</P>
      <P style={{marginLeft:14}}>{"3.  Việc áp dụng công nghệ mới phải bảo đảm các nguyên tắc về an toàn, bảo mật, quyền riêng tư, quyền sở hữu trí tuệ, quản trị rủi ro và tuân thủ pháp luật."}</P>
      <P style={{marginLeft:14}}>{"4.  Công ty chủ động nâng cao năng lực quản trị, chất lượng nguồn nhân lực và khả năng đổi mới để đáp ứng sự phát triển của thị trường và tiến bộ khoa học, công nghệ."}</P>
      <H2 id="dieu-le-chuong-3">{"CHƯƠNG III. NGÀNH, NGHỀ KINH DOANH"}</H2>
      <H3>{"Điều 18. Nguyên tắc kinh doanh"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty thực hiện hoạt động kinh doanh theo nguyên tắc tự do kinh doanh trong những ngành, nghề mà pháp luật không cấm."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty chỉ được kinh doanh các ngành, nghề thuộc danh mục cấm đầu tư kinh doanh hoặc ngành, nghề đầu tư kinh doanh có điều kiện khi đáp ứng đầy đủ các điều kiện theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Mọi hoạt động kinh doanh của Công ty phải tuân thủ:"}</P>
      <P style={{marginLeft:28}}>{"a) Quy định của pháp luật Việt Nam;"}</P>
      <P style={{marginLeft:28}}>{"b) Điều lệ Công ty;"}</P>
      <P style={{marginLeft:28}}>{"c) Quyết định của Chủ sở hữu;"}</P>
      <P style={{marginLeft:28}}>{"d) Các quy chế nội bộ có liên quan."}</P>
      <H3>{"Điều 19. Ngành, nghề kinh doanh của Công ty"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty hoạt động trong các ngành, nghề đã được đăng ký với cơ quan đăng ký kinh doanh theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Tại thời điểm ban hành Điều lệ này, ngành, nghề kinh doanh của Công ty bao gồm:"}</P>
      <P>{"| "}<Strong>{"STT"}</Strong>{" | "}<Strong>{"Ngành, nghề"}</Strong>{" | "}<Strong>{"Mã ngành"}</Strong>{" |"}</P>
      <P>{"| --- | --- | --- |"}</P>
      <P>{"| 1 | Lập trình máy vi tính | 6201 |"}</P>
      <P>{"| 2 | Xuất bản phần mềm | 5820 |"}</P>
      <P>{"| 3 | Xử lý dữ liệu, cho thuê và các hoạt động liên quan | 6311 |"}</P>
      <P>{"| 4 | Cổng thông tin | 6312 |"}</P>
      <P>{"| 5 | Tư vấn máy vi tính và quản trị hệ thống máy vi tính | 6202 |"}</P>
      <P>{"| 6 | Hoạt động dịch vụ công nghệ thông tin và dịch vụ khác liên quan đến máy vi tính | 6209 |"}</P>
      <P>{"| 7 | Hoạt động chuyên môn, khoa học và công nghệ khác chưa được phân vào đâu | 7490 |"}</P>
      <P>{"| 8 | Nghiên cứu khoa học và phát triển công nghệ | 7210 |"}</P>
      <P>{"| 9 | Bán lẻ theo yêu cầu đặt hàng qua bưu điện hoặc Internet | 4791 |"}</P>
      <P style={{marginLeft:14}}>{"3.  Trường hợp nội dung đăng ký ngành, nghề kinh doanh được sửa đổi, bổ sung hoặc thay thế theo quy định của pháp luật, danh mục ngành, nghề của Công ty được hiểu theo nội dung đã được cơ quan đăng ký kinh doanh chấp thuận."}</P>
      <H3>{"Điều 20. Quyền mở rộng ngành, nghề kinh doanh"}</H3>
      <P style={{marginLeft:14}}>{"1.  Chủ sở hữu Công ty có quyền quyết định:"}</P>
      <P style={{marginLeft:28}}>{"a) Bổ sung ngành, nghề kinh doanh;"}</P>
      <P style={{marginLeft:28}}>{"b) Thu hẹp ngành, nghề kinh doanh;"}</P>
      <P style={{marginLeft:28}}>{"c) Chấm dứt hoạt động đối với một hoặc nhiều ngành, nghề;"}</P>
      <P style={{marginLeft:28}}>{"d) Điều chỉnh nội dung đăng ký ngành, nghề kinh doanh."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc thay đổi ngành, nghề kinh doanh được thực hiện theo trình tự, thủ tục do pháp luật quy định."}</P>
      <P style={{marginLeft:14}}>{"3.  Việc sửa đổi hoặc bổ sung ngành, nghề kinh doanh theo khoản này không làm phát sinh nghĩa vụ sửa đổi Điều lệ, trừ trường hợp Chủ sở hữu quyết định khác hoặc pháp luật có quy định bắt buộc."}</P>
      <H3>{"Điều 21. Hoạt động nghiên cứu, phát triển và đổi mới sáng tạo"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty được quyền thực hiện hoạt động nghiên cứu, phát triển, thử nghiệm và ứng dụng các công nghệ mới phục vụ hoạt động sản xuất, kinh doanh."}</P>
      <P style={{marginLeft:14}}>{"2.  Hoạt động nghiên cứu và phát triển có thể được thực hiện độc lập hoặc phối hợp với tổ chức, cá nhân trong nước và nước ngoài theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Kết quả nghiên cứu, dữ liệu nghiên cứu, sáng chế, phần mềm, giải pháp kỹ thuật và các tài sản trí tuệ khác phát sinh từ hoạt động nghiên cứu được quản lý theo quy định của pháp luật và các quy định nội bộ của Công ty."}</P>
      <H3>{"Điều 22. Hoạt động kinh doanh trên môi trường số"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty có quyền cung cấp sản phẩm, dịch vụ và giải pháp thông qua các nền tảng số, phương thức kinh doanh điện tử và hình thức thương mại số khác theo quy định của pháp luật; các nền tảng, mô hình kinh doanh số cụ thể được quy định tại Quy chế nội bộ."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty được quyền triển khai các mô hình kinh doanh mới phát sinh từ sự phát triển của khoa học, công nghệ và chuyển đổi số, với điều kiện phù hợp với quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Việc cung cấp dịch vụ xuyên biên giới phải tuân thủ pháp luật Việt Nam, pháp luật của quốc gia có liên quan và các điều ước quốc tế mà Việt Nam là thành viên khi có quy định áp dụng."}</P>
      <H3>{"Điều 23. Ngành, nghề đầu tư kinh doanh có điều kiện"}</H3>
      <P style={{marginLeft:14}}>{"1.  Đối với ngành, nghề đầu tư kinh doanh có điều kiện, Công ty chỉ được tiến hành hoạt động sau khi đáp ứng đầy đủ các điều kiện theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Trong quá trình hoạt động, Công ty có trách nhiệm duy trì các điều kiện kinh doanh theo quy định của pháp luật đối với từng ngành, nghề có điều kiện."}</P>
      <P style={{marginLeft:14}}>{"3.  Người đại diện theo pháp luật và người quản lý Công ty có trách nhiệm tổ chức việc tuân thủ các điều kiện kinh doanh và chịu trách nhiệm theo quy định của pháp luật."}</P>
      <H3>{"Điều 24. Hạn chế hoạt động kinh doanh"}</H3>
      <P>{"Công ty không được:"}</P>
      <P style={{marginLeft:14}}>{"1.  Kinh doanh các ngành, nghề bị pháp luật cấm."}</P>
      <P style={{marginLeft:14}}>{"2.  Thực hiện các hoạt động nhằm trốn tránh nghĩa vụ pháp lý, nghĩa vụ thuế hoặc nghĩa vụ tài chính khác."}</P>
      <P style={{marginLeft:14}}>{"3.  Thực hiện các hành vi cạnh tranh không lành mạnh, xâm phạm quyền sở hữu trí tuệ hoặc quyền, lợi ích hợp pháp của tổ chức, cá nhân khác."}</P>
      <P style={{marginLeft:14}}>{"4.  Sử dụng công nghệ, dữ liệu hoặc hệ thống thông tin để thực hiện các hành vi trái pháp luật."}</P>
      <P style={{marginLeft:14}}>{"5.  Thực hiện các hoạt động khác bị pháp luật cấm."}</P>
      <H3>{"Điều 25. Nguyên tắc phát triển hoạt động kinh doanh"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty định hướng phát triển hoạt động kinh doanh theo hướng đổi mới sáng tạo, ứng dụng khoa học và công nghệ, nâng cao năng lực cạnh tranh và phát triển bền vững."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc mở rộng hoạt động kinh doanh phải được xem xét trên cơ sở hiệu quả kinh tế, khả năng quản trị rủi ro, nguồn lực của Công ty và sự tuân thủ pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty khuyến khích phát triển các sản phẩm, dịch vụ và giải pháp có giá trị gia tăng cao, đồng thời bảo đảm quyền và lợi ích hợp pháp của khách hàng, đối tác, người lao động và cộng đồng."}</P>
      <H2 id="dieu-le-chuong-4">{"CHƯƠNG IV. CHỦ SỞ HỮU CÔNG TY"}</H2>
      <H3>{"Điều 26. Chủ sở hữu Công ty"}</H3>
      <P style={{marginLeft:14}}>{"1.  Chủ sở hữu Công ty là tổ chức hoặc cá nhân sở hữu toàn bộ vốn điều lệ của Công ty theo quy định của Luật Doanh nghiệp và được ghi nhận trong hồ sơ đăng ký doanh nghiệp. Đối với Công ty tại thời điểm ban hành Điều lệ này, Chủ sở hữu là bà Lê Bích Ngưng, sở hữu 100% vốn điều lệ."}</P>
      <P style={{marginLeft:14}}>{"2.  Chủ sở hữu là chủ thể có quyền quyết định cao nhất đối với việc tổ chức, quản lý và định hướng phát triển của Công ty trong phạm vi quy định của pháp luật và Điều lệ này."}</P>
      <P style={{marginLeft:14}}>{"3.  Chủ sở hữu chịu trách nhiệm về các khoản nợ và nghĩa vụ tài sản khác của Công ty trong phạm vi số vốn điều lệ đã cam kết góp, trừ trường hợp pháp luật có quy định khác."}</P>
      <H3>{"Điều 27. Quyền của Chủ sở hữu"}</H3>
      <P>{"Chủ sở hữu có các quyền sau đây:"}</P>
      <P style={{marginLeft:14}}>{"1.  Quyết định chiến lược, mục tiêu, định hướng và kế hoạch phát triển của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Quyết định sửa đổi, bổ sung hoặc thay thế Điều lệ Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Quyết định tăng, giảm vốn điều lệ theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"4.  Quyết định chuyển nhượng một phần hoặc toàn bộ vốn điều lệ."}</P>
      <P style={{marginLeft:14}}>{"5.  Quyết định tổ chức lại, chuyển đổi loại hình doanh nghiệp, chia, tách, hợp nhất, sáp nhập hoặc giải thể Công ty theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"6.  Quyết định thành lập, tổ chức lại hoặc chấm dứt hoạt động của chi nhánh, văn phòng đại diện, địa điểm kinh doanh và đơn vị phụ thuộc."}</P>
      <P style={{marginLeft:14}}>{"7.  Quyết định cơ cấu tổ chức quản lý của Công ty."}</P>
      <P style={{marginLeft:14}}>{"8.  Bổ nhiệm, miễn nhiệm, cách chức, ký kết hoặc chấm dứt hợp đồng đối với Giám đốc, Tổng Giám đốc và các chức danh quản lý thuộc thẩm quyền."}</P>
      <P style={{marginLeft:14}}>{"9.  Quyết định mức lương, thưởng, quyền lợi và chế độ đối với người quản lý Công ty."}</P>
      <P style={{marginLeft:14}}>{"10. Phê duyệt báo cáo tài chính năm, phương án phân phối lợi nhuận và xử lý lỗ."}</P>
      <P style={{marginLeft:14}}>{"11. Quyết định đầu tư, mua bán, chuyển nhượng, góp vốn, nhận góp vốn hoặc các giao dịch có giá trị lớn theo quy định nội bộ của Công ty."}</P>
      <P style={{marginLeft:14}}>{"12. Quyết định các vấn đề khác thuộc thẩm quyền theo quy định của pháp luật và Điều lệ này."}</P>
      <H3>{"Điều 28. Nghĩa vụ của Chủ sở hữu"}</H3>
      <P>{"Chủ sở hữu có các nghĩa vụ sau:"}</P>
      <P style={{marginLeft:14}}>{"1.  Góp đủ và đúng hạn vốn điều lệ đã cam kết theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Tuân thủ Điều lệ Công ty và các quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Tôn trọng tính độc lập về tài sản giữa Chủ sở hữu và Công ty."}</P>
      <P style={{marginLeft:14}}>{"4.  Không rút vốn khỏi Công ty dưới bất kỳ hình thức nào trái với quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"5.  Chịu trách nhiệm về các quyết định của mình trong phạm vi quyền hạn được pháp luật quy định."}</P>
      <P style={{marginLeft:14}}>{"6.  Thực hiện đầy đủ nghĩa vụ tài chính đối với Nhà nước và các nghĩa vụ khác theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"7.  Bảo đảm việc quản trị Công ty minh bạch, trung thực và phù hợp với lợi ích hợp pháp của Công ty."}</P>
      <H3>{"Điều 29. Thực hiện quyền của Chủ sở hữu"}</H3>
      <P style={{marginLeft:14}}>{"1.  Chủ sở hữu thực hiện quyền của mình thông qua: a) Quyết định của Chủ sở hữu; b) Văn bản chấp thuận; c) Văn bản ủy quyền hợp pháp; d) Các hình thức khác theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Mọi quyết định thuộc thẩm quyền của Chủ sở hữu phải được lập thành văn bản, lưu trữ theo quy định của pháp luật và quy chế lưu trữ của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Quyết định của Chủ sở hữu có hiệu lực kể từ thời điểm được ghi trong quyết định hoặc theo thời điểm được pháp luật quy định."}</P>
      <H3>{"Điều 30. Ủy quyền thực hiện quyền của Chủ sở hữu"}</H3>
      <P style={{marginLeft:14}}>{"1.  Chủ sở hữu có quyền ủy quyền cho cá nhân hoặc tổ chức khác thực hiện một hoặc một số quyền của mình theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc ủy quyền phải được lập thành văn bản, trong đó xác định rõ: a) Phạm vi ủy quyền; b) Thời hạn ủy quyền; c) Quyền và nghĩa vụ của người được ủy quyền; d) Trách nhiệm của các bên."}</P>
      <P style={{marginLeft:14}}>{"3.  Người được ủy quyền chỉ được thực hiện các quyền trong phạm vi được ủy quyền và phải chịu trách nhiệm trước Chủ sở hữu và trước pháp luật về việc thực hiện quyền đó."}</P>
      <P style={{marginLeft:14}}>{"4.  Việc ủy quyền không làm chấm dứt trách nhiệm pháp lý của Chủ sở hữu đối với các quyết định thuộc thẩm quyền của mình, trừ trường hợp pháp luật có quy định khác."}</P>
      <H3>{"Điều 31. Quyết định của Chủ sở hữu"}</H3>
      <P style={{marginLeft:14}}>{"1.  Quyết định của Chủ sở hữu là căn cứ pháp lý để Công ty tổ chức thực hiện các hoạt động quản lý, điều hành và kinh doanh."}</P>
      <P style={{marginLeft:14}}>{"2.  Quyết định của Chủ sở hữu phải bảo đảm: a) Phù hợp với pháp luật; b) Phù hợp với Điều lệ Công ty; c) Không xâm phạm quyền và lợi ích hợp pháp của Công ty hoặc của bên thứ ba."}</P>
      <P style={{marginLeft:14}}>{"3.  Trường hợp quyết định của Chủ sở hữu trái với quy định bắt buộc của pháp luật thì phần trái pháp luật không có hiệu lực; các nội dung còn lại vẫn có giá trị nếu có thể tách biệt và không làm thay đổi bản chất của quyết định."}</P>
      <H3>{"Điều 32. Xung đột lợi ích"}</H3>
      <P style={{marginLeft:14}}>{"1.  Chủ sở hữu có trách nhiệm hành động vì lợi ích hợp pháp và lâu dài của Công ty khi thực hiện quyền của mình."}</P>
      <P style={{marginLeft:14}}>{"2.  Khi Chủ sở hữu đồng thời giữ chức vụ quản lý hoặc đại diện theo pháp luật của Công ty, việc thực hiện quyền và nghĩa vụ ở từng tư cách phải được phân định rõ ràng."}</P>
      <P style={{marginLeft:14}}>{"3.  Các giao dịch giữa Chủ sở hữu và Công ty phải được thực hiện trên nguyên tắc công khai, minh bạch, theo giá trị hợp lý và tuân thủ quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"4.  Mọi hành vi lợi dụng tư cách Chủ sở hữu để gây thiệt hại cho Công ty hoặc cho chủ thể khác đều phải chịu trách nhiệm theo quy định của pháp luật."}</P>
      <H3>{"Điều 33. Chuyển nhượng quyền sở hữu"}</H3>
      <P style={{marginLeft:14}}>{"1.  Chủ sở hữu có quyền chuyển nhượng một phần hoặc toàn bộ vốn điều lệ theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Trường hợp việc chuyển nhượng làm thay đổi loại hình doanh nghiệp, Công ty phải thực hiện việc chuyển đổi theo quy định của Luật Doanh nghiệp."}</P>
      <P style={{marginLeft:14}}>{"3.  Người nhận chuyển nhượng vốn trở thành Chủ sở hữu hoặc thành viên của Công ty kể từ thời điểm hoàn thành các thủ tục theo quy định của pháp luật."}</P>
      <H3>{"Điều 34. Kế thừa quyền của Chủ sở hữu"}</H3>
      <P style={{marginLeft:14}}>{"1.  Khi Chủ sở hữu là cá nhân chết, mất tích, mất năng lực hành vi dân sự hoặc có thay đổi về chủ thể theo quy định của pháp luật, quyền và nghĩa vụ đối với phần vốn góp được thực hiện theo quy định của Bộ luật Dân sự, Luật Doanh nghiệp và các quy định pháp luật có liên quan."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty có trách nhiệm phối hợp với người thừa kế hoặc chủ thể có quyền hợp pháp để thực hiện các thủ tục thay đổi Chủ sở hữu theo quy định của pháp luật."}</P>
      <H2 id="dieu-le-chuong-5">{"CHƯƠNG V. VỐN ĐIỀU LỆ"}</H2>
      <H3>{"Điều 35. Vốn điều lệ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Vốn điều lệ của Công ty tại thời điểm đăng ký thành lập là "}<Strong>{"30.000.000 đồng"}</Strong>{" (Bằng chữ: "}<Strong>{"Ba mươi triệu đồng"}</Strong>{")."}</P>
      <P style={{marginLeft:14}}>{"2.  Chủ sở hữu cam kết góp đủ và đúng loại tài sản đã đăng ký trong thời hạn theo quy định của pháp luật kể từ ngày Công ty được cấp Giấy chứng nhận đăng ký doanh nghiệp."}</P>
      <P style={{marginLeft:14}}>{"3.  Vốn điều lệ được sử dụng để phục vụ hoạt động sản xuất, kinh doanh, đầu tư, phát triển công nghệ, nghiên cứu, quản trị doanh nghiệp và các hoạt động hợp pháp khác của Công ty."}</P>
      <P style={{marginLeft:14}}>{"4.  Công ty quản lý và sử dụng vốn điều lệ theo nguyên tắc hiệu quả, minh bạch, tiết kiệm, đúng mục đích và phù hợp với quy định của pháp luật."}</P>
      <H3>{"Điều 36. Góp vốn"}</H3>
      <P style={{marginLeft:14}}>{"1.  Chủ sở hữu có trách nhiệm góp đủ và đúng hạn số vốn điều lệ đã cam kết."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc góp vốn có thể được thực hiện bằng Đồng Việt Nam, ngoại tệ tự do chuyển đổi, vàng, quyền sử dụng đất, quyền sở hữu trí tuệ, bí quyết kỹ thuật, công nghệ, tài sản hữu hình hoặc tài sản khác được phép góp vốn theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Việc định giá tài sản góp vốn được thực hiện theo quy định của pháp luật và do Chủ sở hữu chịu trách nhiệm."}</P>
      <P style={{marginLeft:14}}>{"4.  Sau khi hoàn thành việc góp vốn, Công ty lập và lưu giữ đầy đủ hồ sơ, chứng từ chứng minh việc góp vốn theo quy định."}</P>
      <H3>{"Điều 37. Thay đổi vốn điều lệ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty có quyền tăng hoặc giảm vốn điều lệ theo quyết định của Chủ sở hữu và phù hợp với quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc tăng vốn điều lệ có thể được thực hiện thông qua một hoặc nhiều hình thức sau đây: a) Chủ sở hữu góp thêm vốn; b) Chuyển đổi từ các nguồn vốn hợp pháp khác của Công ty theo quy định của pháp luật; c) Các hình thức hợp pháp khác."}</P>
      <P style={{marginLeft:14}}>{"3.  Việc giảm vốn điều lệ được thực hiện theo các trường hợp và điều kiện do pháp luật quy định."}</P>
      <P style={{marginLeft:14}}>{"4.  Khi thay đổi vốn điều lệ, Công ty có trách nhiệm thực hiện thủ tục đăng ký thay đổi nội dung đăng ký doanh nghiệp theo quy định của pháp luật."}</P>
      <H3>{"Điều 38. Quản lý và sử dụng vốn"}</H3>
      <P style={{marginLeft:14}}>{"1.  Vốn của Công ty được quản lý thống nhất, minh bạch và có hệ thống."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty thực hiện nguyên tắc tách biệt tài sản của Chủ sở hữu với tài sản của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Mọi khoản thu, chi, đầu tư và sử dụng vốn phải có căn cứ, chứng từ hợp lệ và được ghi nhận đầy đủ theo quy định của pháp luật về kế toán, thuế và tài chính."}</P>
      <P style={{marginLeft:14}}>{"4.  Công ty ưu tiên sử dụng các phương thức thanh toán không dùng tiền mặt trong hoạt động kinh doanh, trừ trường hợp pháp luật có quy định khác."}</P>
      <P style={{marginLeft:14}}>{"5.  Công ty khuyến khích xây dựng và duy trì quỹ dự phòng tài chính nhằm bảo đảm khả năng thanh toán, ổn định hoạt động và phát triển bền vững."}</P>
      <H3>{"Điều 39. Phân phối lợi nhuận"}</H3>
      <P style={{marginLeft:14}}>{"1.  Lợi nhuận sau thuế và sau khi hoàn thành các nghĩa vụ tài chính theo quy định của pháp luật thuộc quyền quyết định của Chủ sở hữu."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc phân phối lợi nhuận phải bảo đảm: a) Công ty đã hoàn thành đầy đủ nghĩa vụ thuế và các nghĩa vụ tài chính khác theo quy định của pháp luật; b) Sau khi phân phối lợi nhuận, Công ty vẫn bảo đảm thanh toán đầy đủ các khoản nợ và nghĩa vụ tài sản đến hạn."}</P>
      <P style={{marginLeft:14}}>{"3.  Chủ sở hữu quyết định việc giữ lại toàn bộ hoặc một phần lợi nhuận để tái đầu tư, phát triển Công ty hoặc phân phối lợi nhuận theo nhu cầu và chiến lược phát triển của Công ty."}</P>
      <P style={{marginLeft:14}}>{"4.  Việc phân phối lợi nhuận phải được lập thành quyết định bằng văn bản và lưu giữ theo quy định của pháp luật."}</P>
      <H2 id="dieu-le-chuong-6">{"CHƯƠNG VI. QUẢN TRỊ VÀ ĐIỀU HÀNH CÔNG TY"}</H2>
      <H3>{"Điều 40. Nguyên tắc quản trị doanh nghiệp"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty được quản trị theo nguyên tắc hợp pháp, minh bạch, trung thực, hiệu quả, trách nhiệm và phát triển bền vững."}</P>
      <P style={{marginLeft:14}}>{"2.  Mọi hoạt động quản trị của Công ty phải bảo đảm: a) Tuân thủ Hiến pháp, pháp luật Việt Nam và các điều ước quốc tế mà Việt Nam là thành viên khi có liên quan; b) Bảo vệ quyền và lợi ích hợp pháp của Chủ sở hữu, khách hàng, người lao động, đối tác và các bên liên quan; c) Đề cao đạo đức kinh doanh, bảo mật thông tin, an toàn dữ liệu và quản trị rủi ro; d) Khuyến khích đổi mới sáng tạo, ứng dụng khoa học, công nghệ và chuyển đổi số trong quản trị và hoạt động kinh doanh."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty xây dựng hệ thống quản trị phù hợp với quy mô, bảo đảm khả năng mở rộng và thích ứng với sự phát triển trong tương lai."}</P>
      <H3>{"Điều 41. Chủ tịch Công ty"}</H3>
      <P style={{marginLeft:14}}>{"1.  Chủ sở hữu đồng thời là Chủ tịch Công ty, trừ trường hợp Chủ sở hữu quyết định bổ nhiệm người khác theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Chủ tịch Công ty có các quyền và nghĩa vụ sau đây: a) Tổ chức thực hiện các quyết định của Chủ sở hữu; b) Đại diện cho Chủ sở hữu trong việc quản trị và điều hành Công ty; c) Ký các nghị quyết, quyết định thuộc thẩm quyền; d) Giám sát việc quản lý, sử dụng tài sản, vốn và nguồn lực của Công ty; đ) Thực hiện các quyền và nghĩa vụ khác theo quy định của pháp luật và Điều lệ này."}</P>
      <H3>{"Điều 42. Quyết định của Chủ sở hữu trong quản trị"}</H3>
      <P style={{marginLeft:14}}>{"1.  Các quyết định thuộc thẩm quyền của Chủ sở hữu được lập thành văn bản hoặc dưới hình thức điện tử theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Quyết định của Chủ sở hữu có hiệu lực kể từ thời điểm được ký hoặc từ thời điểm được quy định trong quyết định."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty có trách nhiệm lưu giữ đầy đủ các quyết định của Chủ sở hữu theo quy định của pháp luật."}</P>
      <H3>{"Điều 43. Quy chế nội bộ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Để phục vụ công tác quản trị, Chủ sở hữu có thể ban hành các quy chế nội bộ, bao gồm nhưng không giới hạn: a) Quy chế tài chính; b) Quy chế kế toán; c) Quy chế nhân sự; d) Quy chế tiền lương, thưởng và phúc lợi; đ) Quy chế bảo mật thông tin và dữ liệu; e) Quy chế quản lý tài sản; g) Quy chế quản trị rủi ro; h) Quy chế an toàn thông tin và an ninh mạng; i) Các quy chế khác phục vụ hoạt động của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Các quy chế nội bộ không được trái với quy định của pháp luật và Điều lệ này."}</P>
      <P style={{marginLeft:14}}>{"3.  Quy chế nội bộ có thể được sửa đổi, bổ sung hoặc thay thế khi cần thiết nhằm đáp ứng yêu cầu quản trị và sự phát triển của Công ty."}</P>
      <H3>{"Điều 44. Quản trị bằng công nghệ và chuyển đổi số"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty khuyến khích áp dụng công nghệ số và các giải pháp công nghệ phù hợp trong quản trị, điều hành, lưu trữ hồ sơ nhằm nâng cao hiệu quả hoạt động; công nghệ cụ thể được áp dụng theo Quy chế nội bộ."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty có thể sử dụng hệ thống quản lý điện tử, chữ ký điện tử, tài liệu điện tử, lưu trữ điện tử và các phương thức làm việc trực tuyến theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty ưu tiên xây dựng hệ thống quản trị minh bạch, có khả năng truy vết, bảo mật, sao lưu dữ liệu và bảo đảm tính liên tục trong hoạt động."}</P>
      <P style={{marginLeft:14}}>{"4.  Công ty khuyến khích nghiên cứu, phát triển, đổi mới sản phẩm, dịch vụ, quy trình và mô hình kinh doanh nhằm nâng cao năng lực cạnh tranh."}</P>
      <H3>{"Điều 45. Người đại diện theo pháp luật"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty có một hoặc nhiều người đại diện theo pháp luật theo quyết định của Chủ sở hữu và phù hợp với quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Thông tin về người đại diện theo pháp luật được đăng ký với cơ quan có thẩm quyền theo quy định của pháp luật và được ghi nhận trong Giấy chứng nhận đăng ký doanh nghiệp."}</P>
      <P style={{marginLeft:14}}>{"3.  Trong trường hợp Công ty có nhiều người đại diện theo pháp luật, quyền, nghĩa vụ và phạm vi đại diện của từng người được xác định theo quyết định của Chủ sở hữu hoặc quy chế nội bộ của Công ty."}</P>
      <H3>{"Điều 46. Quyền của người đại diện theo pháp luật"}</H3>
      <P>{"Người đại diện theo pháp luật có các quyền sau đây:"}</P>
      <P style={{marginLeft:14}}>{"1.  Đại diện Công ty xác lập, thực hiện và chấm dứt các giao dịch dân sự, thương mại và các giao dịch hợp pháp khác."}</P>
      <P style={{marginLeft:14}}>{"2.  Đại diện Công ty làm việc với cơ quan nhà nước, tổ chức, cá nhân trong và ngoài nước."}</P>
      <P style={{marginLeft:14}}>{"3.  Ký kết hợp đồng, văn bản, hồ sơ và các tài liệu thuộc phạm vi thẩm quyền hoặc được Chủ sở hữu giao."}</P>
      <P style={{marginLeft:14}}>{"4.  Đại diện Công ty trong quá trình tố tụng, trọng tài, hòa giải hoặc các thủ tục giải quyết tranh chấp theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"5.  Thực hiện các quyền khác theo quy định của pháp luật, Điều lệ này và quyết định của Chủ sở hữu."}</P>
      <H3>{"Điều 47. Nghĩa vụ của người đại diện theo pháp luật"}</H3>
      <P>{"Người đại diện theo pháp luật có các nghĩa vụ sau đây:"}</P>
      <P style={{marginLeft:14}}>{"1.  Thực hiện quyền và nghĩa vụ được giao một cách trung thực, cẩn trọng, khách quan và vì lợi ích hợp pháp của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Tuân thủ Điều lệ Công ty, quyết định của Chủ sở hữu và các quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Không được lạm dụng chức vụ, quyền hạn hoặc sử dụng tài sản, thông tin, cơ hội kinh doanh của Công ty để phục vụ lợi ích cá nhân hoặc lợi ích của tổ chức, cá nhân khác trái với lợi ích của Công ty."}</P>
      <P style={{marginLeft:14}}>{"4.  Bảo vệ bí mật kinh doanh, bí mật công nghệ, dữ liệu, tài sản trí tuệ và các thông tin mật của Công ty theo quy định của pháp luật và quy chế nội bộ."}</P>
      <P style={{marginLeft:14}}>{"5.  Thông báo kịp thời cho Chủ sở hữu về các rủi ro, sự cố hoặc sự kiện có thể ảnh hưởng đáng kể đến hoạt động của Công ty."}</P>
      <P style={{marginLeft:14}}>{"6.  Chịu trách nhiệm trước Chủ sở hữu và trước pháp luật về việc thực hiện quyền và nghĩa vụ của mình."}</P>
      <H3>{"Điều 48. Thay đổi người đại diện theo pháp luật"}</H3>
      <P style={{marginLeft:14}}>{"1.  Chủ sở hữu có quyền quyết định bổ nhiệm, miễn nhiệm, thay thế hoặc thay đổi người đại diện theo pháp luật theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Khi có thay đổi người đại diện theo pháp luật, Công ty có trách nhiệm thực hiện thủ tục đăng ký thay đổi nội dung đăng ký doanh nghiệp trong thời hạn và theo trình tự, thủ tục do pháp luật quy định."}</P>
      <P style={{marginLeft:14}}>{"3.  Người đại diện theo pháp luật mới kế thừa quyền và nghĩa vụ theo quy định của pháp luật, Điều lệ này và các quyết định của Chủ sở hữu kể từ thời điểm có hiệu lực."}</P>
      <H3>{"Điều 49. Vắng mặt hoặc không thể thực hiện quyền, nghĩa vụ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Khi người đại diện theo pháp luật vắng mặt, mất năng lực hành vi dân sự, bị hạn chế năng lực hành vi dân sự, chết, mất tích hoặc thuộc trường hợp khác theo quy định của pháp luật dẫn đến không thể thực hiện quyền và nghĩa vụ của mình, việc đại diện cho Công ty được thực hiện theo quy định của pháp luật và quyết định của Chủ sở hữu."}</P>
      <P style={{marginLeft:14}}>{"2.  Trường hợp cần thiết, Chủ sở hữu có quyền chỉ định hoặc bổ nhiệm người đại diện theo pháp luật mới nhằm bảo đảm hoạt động liên tục, ổn định của Công ty."}</P>
      <H3>{"Điều 50. Trách nhiệm bảo đảm tính liên tục trong quản trị"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty xây dựng cơ chế bàn giao công việc, hồ sơ, tài sản, dữ liệu, tài khoản, quyền truy cập và các thông tin cần thiết khi thay đổi người đại diện theo pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc bàn giao phải được lập thành văn bản và lưu giữ theo quy định của pháp luật và quy chế nội bộ của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty khuyến khích áp dụng các biện pháp quản trị hiện đại nhằm bảo đảm tính liên tục trong hoạt động, giảm thiểu rủi ro và bảo vệ quyền, lợi ích hợp pháp của Công ty."}</P>
      <H3>{"Điều 51. Nguyên tắc điều hành"}</H3>
      <P style={{marginLeft:14}}>{"1.  Hoạt động điều hành của Công ty phải bảo đảm các nguyên tắc sau đây: a) Tuân thủ pháp luật, Điều lệ Công ty và các quyết định của Chủ sở hữu; b) Minh bạch, trung thực, hiệu quả và có trách nhiệm; c) Bảo đảm tính liên tục, ổn định và an toàn trong hoạt động của Công ty; d) Hướng tới đổi mới sáng tạo, chuyển đổi số và phát triển bền vững; đ) Quản trị rủi ro, bảo vệ tài sản, dữ liệu và quyền lợi hợp pháp của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Mọi hoạt động điều hành phải hướng tới việc nâng cao giá trị doanh nghiệp, năng lực cạnh tranh và uy tín của Công ty."}</P>
      <H3>{"Điều 52. Giám đốc hoặc Tổng Giám đốc"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty có Giám đốc hoặc Tổng Giám đốc do Chủ sở hữu bổ nhiệm hoặc trực tiếp đảm nhiệm theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Giám đốc hoặc Tổng Giám đốc là người điều hành hoạt động kinh doanh hằng ngày của Công ty và chịu trách nhiệm trước Chủ sở hữu về việc thực hiện quyền, nghĩa vụ được giao."}</P>
      <P style={{marginLeft:14}}>{"3.  Giám đốc hoặc Tổng Giám đốc có quyền: a) Tổ chức thực hiện chiến lược, kế hoạch kinh doanh và kế hoạch đầu tư của Công ty; b) Quản lý hoạt động hằng ngày của Công ty; c) Ký kết hợp đồng và thực hiện các giao dịch trong phạm vi thẩm quyền; d) Tuyển dụng, quản lý, đánh giá và chấm dứt quan hệ lao động theo quy định của pháp luật và quy chế nội bộ; đ) Ban hành hoặc trình Chủ sở hữu ban hành các quy trình, quy chế phục vụ hoạt động của Công ty; e) Thực hiện các quyền khác theo quy định của pháp luật, Điều lệ và quyết định của Chủ sở hữu."}</P>
      <H3>{"Điều 53. Bộ máy điều hành"}</H3>
      <P style={{marginLeft:14}}>{"1.  Căn cứ vào quy mô và nhu cầu hoạt động, Công ty có thể thành lập các phòng, ban, đơn vị trực thuộc hoặc bộ phận chuyên môn."}</P>
      <P style={{marginLeft:14}}>{"2.  Chức năng, nhiệm vụ, quyền hạn và mối quan hệ công tác giữa các đơn vị được quy định trong quy chế tổ chức và hoạt động do Chủ sở hữu hoặc người được Chủ sở hữu ủy quyền ban hành."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty có thể thành lập văn phòng đại diện, chi nhánh, địa điểm kinh doanh hoặc các đơn vị phụ thuộc khác theo quy định của pháp luật hoặc theo quyết định của Chủ sở hữu."}</P>
      <H3>{"Điều 54. Quản lý nhân sự"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty thực hiện chính sách tuyển dụng, sử dụng, đào tạo, đánh giá và phát triển nguồn nhân lực trên nguyên tắc công bằng, minh bạch, khách quan và phù hợp với nhu cầu phát triển."}</P>
      <P style={{marginLeft:14}}>{"2.  Người lao động có quyền và nghĩa vụ theo quy định của pháp luật lao động, hợp đồng lao động, nội quy lao động và các quy chế nội bộ của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty khuyến khích xây dựng môi trường làm việc chuyên nghiệp, tôn trọng sự khác biệt, thúc đẩy sáng tạo, học tập liên tục và hợp tác."}</P>
      <H3>{"Điều 55. Trách nhiệm giải trình"}</H3>
      <P style={{marginLeft:14}}>{"1.  Người quản lý, người điều hành và các cá nhân được giao nhiệm vụ có trách nhiệm giải trình về việc thực hiện quyền, nghĩa vụ và nhiệm vụ được giao khi có yêu cầu của Chủ sở hữu hoặc cơ quan có thẩm quyền theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc giải trình phải trung thực, đầy đủ, kịp thời và có căn cứ."}</P>
      <P style={{marginLeft:14}}>{"3.  Hồ sơ, tài liệu phục vụ việc giải trình phải được lưu giữ theo quy định của pháp luật và quy chế nội bộ của Công ty."}</P>
      <H2 id="dieu-le-chuong-7">{"CHƯƠNG VII. CÔNG NGHỆ, DỮ LIỆU VÀ TÀI SẢN SỐ"}</H2>
      <H3>{"Điều 56. Quản trị công nghệ, dữ liệu, tài sản số, sở hữu trí tuệ, trí tuệ nhân tạo và an toàn thông tin"}</H3>
      <P style={{marginLeft:14}}>{"1.  Các vấn đề về quản trị dữ liệu; quản lý và khai thác tài sản số; xác lập, bảo hộ và khai thác quyền sở hữu trí tuệ; nghiên cứu, phát triển và vận hành hệ thống trí tuệ nhân tạo (AI) và phần mềm; và bảo đảm an toàn thông tin của Công ty được quy định chi tiết tại Quy chế Quản trị Công nghệ, Dữ liệu và Tài sản số do Chủ sở hữu ban hành (sau đây gọi là \"Quy chế nội bộ\")."}</P>
      <P style={{marginLeft:14}}>{"2.  Quy chế nội bộ quy định tại Khoản 1 Điều này phải phù hợp với Điều lệ này và quy định của pháp luật hiện hành, bao gồm Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15, Luật Trí tuệ nhân tạo số 134/2025/QH15, Luật Công nghiệp công nghệ số số 71/2025/QH15, Luật An ninh mạng số 24/2018/QH14, Luật Sở hữu trí tuệ số 50/2005/QH11 (sửa đổi, bổ sung) và các văn bản pháp luật chuyên ngành có liên quan."}</P>
      <P style={{marginLeft:14}}>{"3.  Chủ sở hữu có quyền ban hành, sửa đổi, bổ sung hoặc thay thế Quy chế nội bộ bất cứ khi nào cần thiết để phù hợp với sự thay đổi của pháp luật, công nghệ và nhu cầu hoạt động của Công ty, mà không cần sửa đổi Điều lệ này, miễn là nội dung sửa đổi không trái với Điều lệ này."}</P>
      <P style={{marginLeft:14}}>{"4.  Quy chế nội bộ có giá trị áp dụng bắt buộc đối với Chủ sở hữu, Người đại diện theo pháp luật, người quản lý, người lao động, cộng tác viên, nhà thầu và các tổ chức, cá nhân có liên quan trong phạm vi hoạt động của Công ty."}</P>
      <P style={{marginLeft:14}}>{"5.  Trường hợp Quy chế nội bộ trái với Điều lệ này hoặc quy định của pháp luật, quy định của Điều lệ này và pháp luật được ưu tiên áp dụng."}</P>
      <H2 id="dieu-le-chuong-8">{"CHƯƠNG VIII. TÀI CHÍNH VÀ KẾ TOÁN"}</H2>
      <H3>{"Điều 57. Nguyên tắc quản lý tài chính"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty thực hiện quản lý tài chính theo nguyên tắc hợp pháp, minh bạch, trung thực, hiệu quả, tiết kiệm và bảo đảm an toàn tài chính."}</P>
      <P style={{marginLeft:14}}>{"2.  Mọi hoạt động tài chính của Công ty phải tuân thủ quy định của pháp luật về doanh nghiệp, kế toán, thuế, tài chính và các quy định pháp luật có liên quan."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty xây dựng và duy trì hệ thống quản lý tài chính phù hợp với quy mô hoạt động, bảo đảm khả năng mở rộng, quản trị rủi ro và phát triển bền vững."}</P>
      <P style={{marginLeft:14}}>{"4.  Tài sản và nguồn vốn của Công ty được quản lý độc lập với tài sản của Chủ sở hữu và của các tổ chức, cá nhân khác theo quy định của pháp luật."}</P>
      <H3>{"Điều 58. Năm tài chính"}</H3>
      <P style={{marginLeft:14}}>{"1.  Năm tài chính của Công ty bắt đầu từ ngày "}<Strong>{"01 tháng 01"}</Strong>{" và kết thúc vào ngày "}<Strong>{"31 tháng 12"}</Strong>{" hằng năm."}</P>
      <P style={{marginLeft:14}}>{"2.  Năm tài chính đầu tiên được xác định theo quy định của pháp luật đối với doanh nghiệp mới thành lập."}</P>
      <P style={{marginLeft:14}}>{"3.  Trường hợp pháp luật có quy định khác hoặc Công ty được phép áp dụng năm tài chính khác theo quy định của pháp luật thì thực hiện theo quy định đó."}</P>
      <H3>{"Điều 59. Chế độ kế toán"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty áp dụng chế độ kế toán theo quy định của pháp luật Việt Nam."}</P>
      <P style={{marginLeft:14}}>{"2.  Đồng tiền sử dụng trong kế toán là "}<Strong>{"Đồng Việt Nam (VND)"}</Strong>{", trừ trường hợp pháp luật cho phép sử dụng đồng tiền khác."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty thực hiện việc ghi nhận, phản ánh và lưu trữ các nghiệp vụ kinh tế, tài chính đầy đủ, trung thực, chính xác và kịp thời."}</P>
      <P style={{marginLeft:14}}>{"4.  Việc mở, quản lý và lưu giữ sổ kế toán, chứng từ kế toán, báo cáo tài chính và tài liệu kế toán được thực hiện theo quy định của pháp luật."}</P>
      <H3>{"Điều 60. Quản lý doanh thu, chi phí và tài sản"}</H3>
      <P style={{marginLeft:14}}>{"1.  Doanh thu, chi phí, tài sản, nợ phải trả và các giao dịch tài chính của Công ty phải được ghi nhận đầy đủ theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Mọi khoản thu, chi của Công ty phải có căn cứ, chứng từ hợp pháp, hợp lệ và được phê duyệt theo quy chế nội bộ hoặc quyết định của người có thẩm quyền."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty ưu tiên thực hiện thanh toán không dùng tiền mặt trong các giao dịch, trừ trường hợp pháp luật có quy định khác."}</P>
      <P style={{marginLeft:14}}>{"4.  Tài sản của Công ty được quản lý, sử dụng và bảo vệ theo nguyên tắc hiệu quả, tiết kiệm và đúng mục đích."}</P>
      <H3>{"Điều 61. Thuế và nghĩa vụ tài chính"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty thực hiện đầy đủ, đúng thời hạn các nghĩa vụ về thuế, phí, lệ phí và các nghĩa vụ tài chính khác theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty thực hiện việc kê khai, nộp thuế, quyết toán thuế và lưu giữ hồ sơ thuế theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty có trách nhiệm phối hợp với cơ quan nhà nước có thẩm quyền trong việc thanh tra, kiểm tra, kiểm toán hoặc giải trình các vấn đề liên quan đến tài chính, kế toán và thuế theo quy định của pháp luật."}</P>
      <H3>{"Điều 62. Báo cáo tài chính"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty lập báo cáo tài chính theo quy định của pháp luật và phản ánh trung thực, hợp lý tình hình tài chính, kết quả hoạt động kinh doanh và lưu chuyển tiền tệ của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Báo cáo tài chính được lập đúng thời hạn, đúng chuẩn mực và được lưu giữ theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Chủ sở hữu có quyền yêu cầu lập các báo cáo quản trị, báo cáo phân tích hoặc các báo cáo tài chính nội bộ phục vụ công tác quản trị và điều hành."}</P>
      <H3>{"Điều 63. Kiểm toán"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty thực hiện kiểm toán khi thuộc đối tượng bắt buộc theo quy định của pháp luật hoặc theo quyết định của Chủ sở hữu."}</P>
      <P style={{marginLeft:14}}>{"2.  Chủ sở hữu có quyền thuê tổ chức kiểm toán độc lập hoặc chuyên gia độc lập để kiểm tra báo cáo tài chính, hệ thống kiểm soát nội bộ hoặc các hoạt động tài chính của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty có trách nhiệm cung cấp đầy đủ, trung thực và kịp thời các hồ sơ, tài liệu phục vụ hoạt động kiểm toán theo quy định của pháp luật."}</P>
      <H3>{"Điều 64. Quản lý chứng từ và lưu trữ hồ sơ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty thực hiện việc lập, quản lý, bảo quản và lưu trữ chứng từ kế toán, hồ sơ tài chính và tài liệu liên quan theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Chứng từ và tài liệu kế toán có thể được lưu trữ dưới hình thức giấy, điện tử hoặc hình thức khác được pháp luật cho phép."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty áp dụng các biện pháp phù hợp nhằm bảo đảm tính toàn vẹn, bảo mật, khả năng truy xuất và an toàn của dữ liệu tài chính, kế toán."}</P>
      <H3>{"Điều 65. Kiểm soát tài chính"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty xây dựng cơ chế kiểm soát tài chính phù hợp nhằm: a) Bảo đảm việc sử dụng tài sản, nguồn vốn đúng mục đích; b) Phòng ngừa gian lận, thất thoát và sai sót; c) Nâng cao hiệu quả quản lý và sử dụng nguồn lực; d) Hỗ trợ công tác quản trị rủi ro và ra quyết định."}</P>
      <P style={{marginLeft:14}}>{"2.  Chủ sở hữu có quyền ban hành hoặc sửa đổi các quy chế tài chính, quy chế kế toán, quy chế kiểm soát nội bộ và các quy định khác nhằm đáp ứng yêu cầu quản trị của Công ty."}</P>
      <H2 id="dieu-le-chuong-9">{"CHƯƠNG IX. LAO ĐỘNG"}</H2>
      <H3>{"Điều 66. Nguyên tắc về lao động"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty xây dựng môi trường làm việc chuyên nghiệp, minh bạch, an toàn, bình đẳng, tôn trọng và khuyến khích đổi mới sáng tạo."}</P>
      <P style={{marginLeft:14}}>{"2.  Quan hệ lao động giữa Công ty và người lao động được xác lập trên cơ sở tự nguyện, thiện chí, hợp tác, bình đẳng và tuân thủ quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty tôn trọng quyền và lợi ích hợp pháp của người lao động, đồng thời yêu cầu người lao động thực hiện đầy đủ nghĩa vụ theo hợp đồng lao động, Điều lệ, nội quy và các quy chế nội bộ của Công ty."}</P>
      <H3>{"Điều 67. Tuyển dụng và sử dụng lao động"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty thực hiện việc tuyển dụng trên cơ sở năng lực, trình độ chuyên môn, phẩm chất nghề nghiệp và nhu cầu hoạt động của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty bảo đảm nguyên tắc bình đẳng trong tuyển dụng, không phân biệt đối xử trái pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Việc tuyển dụng, bố trí, điều chuyển, đánh giá, đào tạo, bổ nhiệm và chấm dứt quan hệ lao động được thực hiện theo quy định của pháp luật và quy chế nội bộ của Công ty."}</P>
      <P style={{marginLeft:14}}>{"4.  Công ty có quyền sử dụng người lao động trong nước hoặc nước ngoài theo quy định của pháp luật."}</P>
      <H3>{"Điều 68. Quyền và nghĩa vụ của người lao động"}</H3>
      <P style={{marginLeft:14}}>{"1.  Người lao động có các quyền theo quy định của pháp luật, hợp đồng lao động và các quy định nội bộ của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Người lao động có trách nhiệm:"}</P>
      <P style={{marginLeft:28}}>{"a) Thực hiện đúng công việc được giao;"}</P>
      <P style={{marginLeft:28}}>{"b) Tuân thủ pháp luật, Điều lệ, nội quy lao động và các quy chế nội bộ của Công ty;"}</P>
      <P style={{marginLeft:28}}>{"c) Bảo vệ tài sản, thông tin, dữ liệu và uy tín của Công ty;"}</P>
      <P style={{marginLeft:28}}>{"d) Giữ bí mật kinh doanh, bí mật công nghệ và các thông tin thuộc phạm vi bảo mật;"}</P>
      <P style={{marginLeft:28}}>{"đ) Sử dụng hợp lý tài sản và nguồn lực của Công ty;"}</P>
      <P style={{marginLeft:28}}>{"e) Báo cáo kịp thời các rủi ro, sự cố hoặc hành vi vi phạm có thể ảnh hưởng đến Công ty."}</P>
      <H3>{"Điều 69. Đào tạo và phát triển nguồn nhân lực"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty khuyến khích học tập, nghiên cứu, đổi mới sáng tạo và nâng cao trình độ chuyên môn, kỹ năng nghề nghiệp."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty có thể tổ chức hoặc hỗ trợ các chương trình đào tạo, bồi dưỡng chuyên môn, kỹ năng quản lý, ngoại ngữ, công nghệ, an toàn thông tin và các lĩnh vực khác phục vụ hoạt động của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Người lao động có trách nhiệm tham gia các chương trình đào tạo theo yêu cầu của Công ty khi phù hợp với quy định của pháp luật và thỏa thuận giữa các bên."}</P>
      <H3>{"Điều 70. Chính sách về người lao động"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty xây dựng chính sách tiền lương, tiền thưởng, phúc lợi và các chế độ khác trên cơ sở hiệu quả công việc, khả năng tài chính của Công ty và quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty thực hiện đầy đủ các nghĩa vụ về bảo hiểm xã hội, bảo hiểm y tế, bảo hiểm thất nghiệp và các nghĩa vụ khác theo quy định của pháp luật đối với người lao động thuộc diện áp dụng."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty khuyến khích xây dựng môi trường làm việc linh hoạt, ứng dụng công nghệ và tạo điều kiện để người lao động cân bằng giữa công việc và cuộc sống khi phù hợp với đặc điểm hoạt động của Công ty."}</P>
      <H3>{"Điều 71. An toàn, vệ sinh lao động"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty thực hiện các biện pháp cần thiết nhằm bảo đảm an toàn, vệ sinh lao động theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Người lao động có trách nhiệm tuân thủ các quy định về an toàn, vệ sinh lao động và sử dụng đúng các trang thiết bị được cấp."}</P>
      <P style={{marginLeft:14}}>{"3.  Khi xảy ra tai nạn lao động hoặc sự cố liên quan đến an toàn lao động, Công ty và người lao động có trách nhiệm phối hợp xử lý theo quy định của pháp luật."}</P>
      <H3>{"Điều 72. Đạo đức nghề nghiệp"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty khuyến khích người lao động thực hiện công việc với tinh thần trung thực, trách nhiệm, hợp tác, chuyên nghiệp và tôn trọng đồng nghiệp, khách hàng, đối tác."}</P>
      <P style={{marginLeft:14}}>{"2.  Người lao động không được lợi dụng chức vụ, quyền hạn hoặc vị trí công tác để vụ lợi hoặc thực hiện các hành vi trái pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty khuyến khích văn hóa phản hồi mang tính xây dựng, giải quyết mâu thuẫn trên cơ sở đối thoại và tôn trọng lẫn nhau."}</P>
      <H3>{"Điều 73. Bảo mật và xung đột lợi ích"}</H3>
      <P style={{marginLeft:14}}>{"1.  Người lao động có trách nhiệm bảo mật các thông tin thuộc phạm vi bí mật kinh doanh, bí mật công nghệ, dữ liệu và các thông tin khác theo quy định của pháp luật và quy định của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Người lao động phải thông báo cho Công ty khi phát sinh hoặc có khả năng phát sinh xung đột lợi ích có ảnh hưởng đáng kể đến việc thực hiện nhiệm vụ."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty có quyền ban hành quy chế về bảo mật thông tin và quản lý xung đột lợi ích phù hợp với quy định của pháp luật."}</P>
      <H3>{"Điều 74. Quản lý lao động"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty có quyền ban hành nội quy lao động, quy chế nhân sự và các quy định nội bộ khác theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Các vấn đề về tuyển dụng, tiền lương, tiền thưởng, thời giờ làm việc, thời giờ nghỉ ngơi, đánh giá hiệu quả công việc, kỷ luật lao động, chấm dứt hợp đồng lao động và các nội dung khác được thực hiện theo quy định của pháp luật và các quy chế nội bộ của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Chủ sở hữu có quyền sửa đổi, bổ sung hoặc ban hành mới các quy chế về lao động nhằm đáp ứng yêu cầu phát triển của Công ty và phù hợp với quy định của pháp luật."}</P>
      <H2 id="dieu-le-chuong-10">{"CHƯƠNG X. KIỂM TOÁN"}</H2>
      <H3>{"Điều 75. Nguyên tắc kiểm toán"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty thực hiện hoạt động kiểm toán nhằm bảo đảm tính trung thực, minh bạch, khách quan và hiệu quả trong công tác quản trị, tài chính, kế toán và hoạt động kinh doanh."}</P>
      <P style={{marginLeft:14}}>{"2.  Hoạt động kiểm toán được thực hiện theo quy định của pháp luật, Điều lệ này và các quy chế nội bộ của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Kiểm toán không làm thay đổi trách nhiệm của Chủ sở hữu, người quản lý hoặc người lao động đối với các nghĩa vụ theo quy định của pháp luật."}</P>
      <H3>{"Điều 76. Mục tiêu kiểm toán"}</H3>
      <P>{"Hoạt động kiểm toán của Công ty nhằm:"}</P>
      <P style={{marginLeft:28}}>{"a) Đánh giá tính trung thực, hợp lý của thông tin tài chính;"}</P>
      <P style={{marginLeft:28}}>{"b) Đánh giá việc tuân thủ pháp luật, Điều lệ và các quy định nội bộ;"}</P>
      <P style={{marginLeft:28}}>{"c) Đánh giá hiệu quả của hệ thống kiểm soát nội bộ và quản trị rủi ro;"}</P>
      <P style={{marginLeft:28}}>{"d) Phát hiện, phòng ngừa và hạn chế gian lận, sai sót hoặc các hành vi vi phạm;"}</P>
      <P style={{marginLeft:28}}>{"đ) Đề xuất các giải pháp nâng cao hiệu quả hoạt động và quản trị doanh nghiệp."}</P>
      <H3>{"Điều 77. Kiểm toán nội bộ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Căn cứ vào quy mô và nhu cầu hoạt động, Công ty có thể tổ chức bộ phận kiểm toán nội bộ hoặc giao cá nhân, bộ phận có chuyên môn thực hiện chức năng kiểm toán nội bộ."}</P>
      <P style={{marginLeft:14}}>{"2.  Hoạt động kiểm toán nội bộ được thực hiện độc lập, khách quan trong phạm vi nhiệm vụ được giao."}</P>
      <P style={{marginLeft:14}}>{"3.  Nội dung, phạm vi, phương pháp và quy trình kiểm toán nội bộ được quy định trong quy chế nội bộ của Công ty."}</P>
      <H3>{"Điều 78. Kiểm toán độc lập"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty thực hiện kiểm toán độc lập khi:"}</P>
      <P style={{marginLeft:28}}>{"a) Pháp luật quy định bắt buộc;"}</P>
      <P style={{marginLeft:28}}>{"b) Chủ sở hữu quyết định;"}</P>
      <P style={{marginLeft:28}}>{"c) Theo yêu cầu của cơ quan nhà nước có thẩm quyền hoặc theo thỏa thuận với đối tác, nhà đầu tư, tổ chức tín dụng hoặc các bên liên quan."}</P>
      <P style={{marginLeft:14}}>{"2.  Tổ chức kiểm toán độc lập được lựa chọn phải đáp ứng các điều kiện theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty có trách nhiệm cung cấp đầy đủ, trung thực và kịp thời các tài liệu, hồ sơ cần thiết phục vụ hoạt động kiểm toán."}</P>
      <H3>{"Điều 79. Quyền và trách nhiệm của người thực hiện kiểm toán"}</H3>
      <P style={{marginLeft:14}}>{"1.  Người thực hiện kiểm toán có quyền tiếp cận các hồ sơ, tài liệu, dữ liệu và thông tin cần thiết phục vụ công tác kiểm toán theo quy định của pháp luật và quy chế nội bộ."}</P>
      <P style={{marginLeft:14}}>{"2.  Người thực hiện kiểm toán có trách nhiệm:"}</P>
      <P style={{marginLeft:28}}>{"a) Bảo đảm tính độc lập, khách quan và trung thực;"}</P>
      <P style={{marginLeft:28}}>{"b) Bảo mật thông tin trong quá trình kiểm toán;"}</P>
      <P style={{marginLeft:28}}>{"c) Chỉ sử dụng thông tin phục vụ mục đích kiểm toán;"}</P>
      <P style={{marginLeft:28}}>{"d) Báo cáo đầy đủ, chính xác và kịp thời kết quả kiểm toán."}</P>
      <P style={{marginLeft:14}}>{"3.  Không cá nhân hoặc bộ phận nào được cản trở trái pháp luật hoạt động kiểm toán."}</P>
      <H3>{"Điều 80. Trách nhiệm của Công ty"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty có trách nhiệm:"}</P>
      <P style={{marginLeft:28}}>{"a) Tạo điều kiện thuận lợi cho hoạt động kiểm toán;"}</P>
      <P style={{marginLeft:28}}>{"b) Cung cấp đầy đủ hồ sơ, tài liệu và thông tin theo yêu cầu hợp pháp của hoạt động kiểm toán;"}</P>
      <P style={{marginLeft:28}}>{"c) Phối hợp thực hiện các biện pháp cần thiết để bảo đảm hiệu quả kiểm toán."}</P>
      <P style={{marginLeft:14}}>{"2.  Người quản lý và người lao động có trách nhiệm hợp tác với hoạt động kiểm toán trong phạm vi nhiệm vụ của mình."}</P>
      <H3>{"Điều 81. Báo cáo và xử lý kết quả kiểm toán"}</H3>
      <P style={{marginLeft:14}}>{"1.  Kết quả kiểm toán được lập thành báo cáo và lưu giữ theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Chủ sở hữu xem xét kết quả kiểm toán và quyết định các biện pháp xử lý, khắc phục, cải tiến hoặc các biện pháp cần thiết khác."}</P>
      <P style={{marginLeft:14}}>{"3.  Trường hợp phát hiện dấu hiệu vi phạm pháp luật, Công ty thực hiện các biện pháp xử lý theo quy định của pháp luật."}</P>
      <H3>{"Điều 82. Bảo mật thông tin kiểm toán"}</H3>
      <P style={{marginLeft:14}}>{"1.  Hồ sơ, tài liệu và kết quả kiểm toán được quản lý và bảo mật theo quy định của pháp luật và quy chế nội bộ của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc công bố hoặc cung cấp thông tin kiểm toán cho tổ chức, cá nhân khác chỉ được thực hiện:"}</P>
      <P style={{marginLeft:28}}>{"a) Theo quy định của pháp luật;"}</P>
      <P style={{marginLeft:28}}>{"b) Theo quyết định của Chủ sở hữu;"}</P>
      <P style={{marginLeft:28}}>{"c) Theo yêu cầu của cơ quan nhà nước có thẩm quyền."}</P>
      <H3>{"Điều 83. Hoàn thiện hệ thống kiểm toán"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty định kỳ đánh giá và hoàn thiện hệ thống kiểm toán nhằm nâng cao hiệu quả quản trị doanh nghiệp."}</P>
      <P style={{marginLeft:14}}>{"2.  Chủ sở hữu có quyền ban hành hoặc sửa đổi quy chế kiểm toán nội bộ, quy chế kiểm soát nội bộ và các quy định có liên quan phù hợp với quy định của pháp luật và chiến lược phát triển của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty khuyến khích áp dụng các phương pháp, công nghệ và thông lệ quản trị tiên tiến nhằm nâng cao chất lượng hoạt động kiểm toán."}</P>
      <H2 id="dieu-le-chuong-11">{"CHƯƠNG XI. TUÂN THỦ PHÁP LUẬT"}</H2>
      <H3>{"Điều 84. Nguyên tắc tuân thủ pháp luật"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty cam kết hoạt động trên cơ sở thượng tôn pháp luật, trung thực, minh bạch, trách nhiệm và phát triển bền vững."}</P>
      <P style={{marginLeft:14}}>{"2.  Mọi hoạt động của Công ty, Chủ sở hữu, người quản lý, người lao động và các cá nhân, tổ chức hoạt động nhân danh Công ty phải tuân thủ: a) Hiến pháp và pháp luật của nước Cộng hòa xã hội chủ nghĩa Việt Nam; b) Điều lệ Công ty; c) Các quy chế nội bộ của Công ty; d) Điều ước quốc tế mà Việt Nam là thành viên khi có quy định áp dụng; đ) Các nghĩa vụ pháp lý phát sinh từ hợp đồng hoặc cam kết hợp pháp của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Không cá nhân nào được nhân danh Công ty để thực hiện hành vi trái pháp luật hoặc vượt quá phạm vi thẩm quyền được giao."}</P>
      <H3>{"Điều 85. Hệ thống quản trị tuân thủ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty xây dựng hệ thống quản trị tuân thủ phù hợp với quy mô, lĩnh vực hoạt động và mức độ rủi ro của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Hệ thống quản trị tuân thủ có thể bao gồm:"}</P>
      <P style={{marginLeft:28}}>{"a) Chính sách tuân thủ;"}</P>
      <P style={{marginLeft:28}}>{"b) Quy chế nội bộ;"}</P>
      <P style={{marginLeft:28}}>{"c) Quy trình kiểm soát;"}</P>
      <P style={{marginLeft:28}}>{"d) Đánh giá rủi ro tuân thủ;"}</P>
      <P style={{marginLeft:28}}>{"đ) Kiểm tra, giám sát và báo cáo;"}</P>
      <P style={{marginLeft:28}}>{"e) Đào tạo và phổ biến pháp luật;"}</P>
      <P style={{marginLeft:28}}>{"g) Các biện pháp quản trị khác theo quyết định của Chủ sở hữu."}</P>
      <P style={{marginLeft:14}}>{"3.  Chủ sở hữu có quyền ban hành, sửa đổi hoặc bãi bỏ các chính sách và quy chế nhằm nâng cao hiệu quả quản trị tuân thủ."}</P>
      <H3>{"Điều 86. Trách nhiệm tuân thủ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Chủ sở hữu, người đại diện theo pháp luật, người quản lý, người lao động, cộng tác viên và các cá nhân được Công ty giao nhiệm vụ có trách nhiệm tuân thủ pháp luật và các quy định nội bộ của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Người giữ chức vụ quản lý có trách nhiệm tổ chức, hướng dẫn và giám sát việc tuân thủ trong phạm vi quản lý của mình."}</P>
      <P style={{marginLeft:14}}>{"3.  Không cá nhân nào được viện dẫn mệnh lệnh hoặc chỉ đạo trái pháp luật để miễn trừ trách nhiệm của mình."}</P>
      <H3>{"Điều 87. Phòng ngừa vi phạm"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty thực hiện các biện pháp phòng ngừa nhằm hạn chế rủi ro pháp lý và rủi ro tuân thủ."}</P>
      <P style={{marginLeft:14}}>{"2.  Các biện pháp phòng ngừa có thể bao gồm:"}</P>
      <P style={{marginLeft:28}}>{"a) Đánh giá rủi ro pháp lý;"}</P>
      <P style={{marginLeft:28}}>{"b) Kiểm tra tính hợp pháp của hoạt động kinh doanh;"}</P>
      <P style={{marginLeft:28}}>{"c) Kiểm soát nội bộ;"}</P>
      <P style={{marginLeft:28}}>{"d) Kiểm toán;"}</P>
      <P style={{marginLeft:28}}>{"đ) Đào tạo pháp luật;"}</P>
      <P style={{marginLeft:28}}>{"e) Tư vấn pháp lý;"}</P>
      <P style={{marginLeft:28}}>{"g) Các biện pháp khác phù hợp với quy định của pháp luật."}</P>
      <H3>{"Điều 88. Báo cáo và xử lý vi phạm"}</H3>
      <P style={{marginLeft:14}}>{"1.  Cá nhân phát hiện hành vi có dấu hiệu vi phạm pháp luật, Điều lệ hoặc quy định nội bộ có trách nhiệm thông báo kịp thời cho người có thẩm quyền trong Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty xây dựng cơ chế tiếp nhận, xem xét và xử lý các thông tin về vi phạm trên cơ sở khách quan, trung thực và đúng quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Người có hành vi vi phạm phải chịu trách nhiệm theo quy định của pháp luật, Điều lệ, hợp đồng và các quy định nội bộ của Công ty."}</P>
      <H3>{"Điều 89. Hợp tác với cơ quan có thẩm quyền"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty có trách nhiệm hợp tác với cơ quan nhà nước có thẩm quyền trong phạm vi pháp luật quy định."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc cung cấp thông tin, tài liệu hoặc thực hiện yêu cầu của cơ quan có thẩm quyền phải bảo đảm:"}</P>
      <P style={{marginLeft:28}}>{"a) Đúng thẩm quyền;"}</P>
      <P style={{marginLeft:28}}>{"b) Đúng quy định của pháp luật;"}</P>
      <P style={{marginLeft:28}}>{"c) Bảo vệ bí mật kinh doanh, bí mật công nghệ, dữ liệu cá nhân và các thông tin được pháp luật bảo vệ."}</P>
      <H3>{"Điều 90. Đào tạo và nâng cao nhận thức về tuân thủ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty khuyến khích việc đào tạo và phổ biến kiến thức pháp luật, đạo đức nghề nghiệp và văn hóa tuân thủ cho người quản lý, người lao động và các cá nhân có liên quan."}</P>
      <P style={{marginLeft:14}}>{"2.  Nội dung đào tạo được cập nhật phù hợp với sự thay đổi của pháp luật, hoạt động kinh doanh và chiến lược phát triển của Công ty."}</P>
      <H3>{"Điều 91. Cải tiến hệ thống tuân thủ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty định kỳ rà soát, đánh giá và cải tiến hệ thống quản trị tuân thủ nhằm đáp ứng yêu cầu của pháp luật và thực tiễn hoạt động."}</P>
      <P style={{marginLeft:14}}>{"2.  Chủ sở hữu có quyền quyết định việc sửa đổi, bổ sung hoặc ban hành mới các chính sách, quy chế và quy trình về quản trị tuân thủ."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty khuyến khích áp dụng các thông lệ quản trị tiên tiến nhằm nâng cao hiệu quả tuân thủ, quản trị rủi ro và phát triển bền vững."}</P>
      <H2 id="dieu-le-chuong-12">{"CHƯƠNG XII. CHỐNG XUNG ĐỘT LỢI ÍCH"}</H2>
      <H3>{"Điều 92. Nguyên tắc phòng ngừa xung đột lợi ích"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty thực hiện các biện pháp phòng ngừa, phát hiện, quản lý và xử lý xung đột lợi ích nhằm bảo đảm tính trung thực, minh bạch, khách quan và bảo vệ quyền, lợi ích hợp pháp của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Chủ sở hữu, người đại diện theo pháp luật, người quản lý, người lao động, cộng tác viên và các tổ chức, cá nhân hoạt động nhân danh Công ty có trách nhiệm tránh để lợi ích cá nhân hoặc lợi ích của bên thứ ba ảnh hưởng không phù hợp đến việc thực hiện nhiệm vụ được giao."}</P>
      <P style={{marginLeft:14}}>{"3.  Mọi quyết định của Công ty phải được đưa ra trên cơ sở lợi ích hợp pháp của Công ty, tuân thủ pháp luật, Điều lệ và các quy chế nội bộ."}</P>
      <H3>{"Điều 93. Các trường hợp có thể phát sinh xung đột lợi ích"}</H3>
      <P style={{marginLeft:14}}>{"1.  Xung đột lợi ích có thể phát sinh trong các trường hợp bao gồm nhưng không giới hạn:"}</P>
      <P style={{marginLeft:28}}>{"a) Cá nhân hoặc người có liên quan có lợi ích tài chính trực tiếp hoặc gián tiếp trong giao dịch với Công ty;"}</P>
      <P style={{marginLeft:28}}>{"b) Sử dụng thông tin, dữ liệu, bí mật kinh doanh, tài sản số hoặc tài sản trí tuệ của Công ty nhằm phục vụ lợi ích cá nhân hoặc của bên thứ ba;"}</P>
      <P style={{marginLeft:28}}>{"c) Tham gia quản lý, điều hành hoặc làm việc cho tổ chức khác có khả năng tạo ra xung đột lợi ích với Công ty;"}</P>
      <P style={{marginLeft:28}}>{"d) Lợi dụng chức vụ, quyền hạn hoặc nhiệm vụ được giao để thu lợi cá nhân;"}</P>
      <P style={{marginLeft:28}}>{"đ) Ưu tiên lợi ích của cá nhân, tổ chức hoặc bên thứ ba trái với lợi ích hợp pháp của Công ty;"}</P>
      <P style={{marginLeft:28}}>{"e) Các trường hợp khác theo quy định của pháp luật hoặc quy chế nội bộ."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc tồn tại khả năng phát sinh xung đột lợi ích không mặc nhiên được coi là hành vi vi phạm, nhưng phải được quản lý theo quy định của Điều lệ này và pháp luật."}</P>
      <H3>{"Điều 94. Nghĩa vụ kê khai và thông báo"}</H3>
      <P style={{marginLeft:14}}>{"1.  Cá nhân có khả năng phát sinh xung đột lợi ích có trách nhiệm chủ động thông báo đầy đủ, trung thực và kịp thời cho người có thẩm quyền của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Nội dung thông báo phải phản ánh đầy đủ các thông tin có liên quan đến khả năng phát sinh xung đột lợi ích trong phạm vi pháp luật cho phép."}</P>
      <P style={{marginLeft:14}}>{"3.  Nghĩa vụ thông báo được thực hiện ngay khi cá nhân biết hoặc phải biết về khả năng phát sinh xung đột lợi ích."}</P>
      <H3>{"Điều 95. Quản lý xung đột lợi ích"}</H3>
      <P style={{marginLeft:14}}>{"1.  Khi phát sinh hoặc có nguy cơ phát sinh xung đột lợi ích, Công ty có thể áp dụng một hoặc nhiều biện pháp sau đây:"}</P>
      <P style={{marginLeft:28}}>{"a) Yêu cầu kê khai hoặc bổ sung thông tin;"}</P>
      <P style={{marginLeft:28}}>{"b) Hạn chế hoặc thu hồi quyền tham gia vào việc xem xét, quyết định hoặc thực hiện giao dịch có liên quan;"}</P>
      <P style={{marginLeft:28}}>{"c) Chuyển giao nhiệm vụ cho cá nhân hoặc bộ phận khác;"}</P>
      <P style={{marginLeft:28}}>{"d) Áp dụng các biện pháp quản lý khác theo quy định của pháp luật và quy chế nội bộ."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc lựa chọn biện pháp xử lý phải bảo đảm khách quan, hợp lý, phù hợp với tính chất và mức độ của từng trường hợp."}</P>
      <H3>{"Điều 96. Giao dịch với người có liên quan"}</H3>
      <P style={{marginLeft:14}}>{"1.  Các giao dịch giữa Công ty với Chủ sở hữu, người quản lý hoặc người có liên quan được thực hiện theo quy định của Luật Doanh nghiệp, Điều lệ này và pháp luật có liên quan."}</P>
      <P style={{marginLeft:14}}>{"2.  Các giao dịch quy định tại khoản 1 Điều này phải được thực hiện trên cơ sở trung thực, công bằng, minh bạch và vì lợi ích hợp pháp của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Cá nhân có lợi ích liên quan không được lợi dụng vị trí của mình để gây ảnh hưởng không phù hợp đến việc xem xét hoặc quyết định giao dịch."}</P>
      <H3>{"Điều 97. Bảo vệ thông tin và tài sản của Công ty"}</H3>
      <P style={{marginLeft:14}}>{"1.  Không cá nhân nào được sử dụng trái phép thông tin, dữ liệu, tài sản số, tài sản trí tuệ, bí mật kinh doanh hoặc các tài sản khác của Công ty nhằm phục vụ lợi ích cá nhân hoặc lợi ích của bên thứ ba."}</P>
      <P style={{marginLeft:14}}>{"2.  Mọi hành vi khai thác, sao chép, chuyển giao hoặc tiết lộ tài sản của Công ty phải tuân thủ pháp luật và quy chế nội bộ."}</P>
      <H3>{"Điều 98. Báo cáo và xử lý vi phạm"}</H3>
      <P style={{marginLeft:14}}>{"1.  Cá nhân phát hiện hành vi có dấu hiệu xung đột lợi ích hoặc vi phạm quy định của Chương này có trách nhiệm thông báo cho người có thẩm quyền trong Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty xem xét, xác minh và xử lý vụ việc trên cơ sở khách quan, công bằng và đúng quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Người vi phạm phải chịu trách nhiệm theo quy định của pháp luật, Điều lệ, hợp đồng và các quy chế nội bộ của Công ty."}</P>
      <H3>{"Điều 99. Hoàn thiện cơ chế phòng ngừa xung đột lợi ích"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty định kỳ rà soát và hoàn thiện các chính sách, quy trình và quy chế nhằm nâng cao hiệu quả phòng ngừa, phát hiện và xử lý xung đột lợi ích."}</P>
      <P style={{marginLeft:14}}>{"2.  Chủ sở hữu có quyền ban hành hoặc sửa đổi các quy chế nội bộ về quản lý xung đột lợi ích phù hợp với quy định của pháp luật và nhu cầu quản trị của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty khuyến khích xây dựng văn hóa trung thực, minh bạch, trách nhiệm và liêm chính trong mọi hoạt động nhằm hạn chế nguy cơ phát sinh xung đột lợi ích."}</P>
      <H2 id="dieu-le-chuong-13">{"CHƯƠNG XIII. CHỐNG THAM NHŨNG"}</H2>
      <H3>{"Điều 100. Nguyên tắc phòng, chống tham nhũng"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty cam kết thực hiện hoạt động kinh doanh trung thực, minh bạch, liêm chính và không dung thứ đối với mọi hành vi tham nhũng dưới bất kỳ hình thức nào."}</P>
      <P style={{marginLeft:14}}>{"2.  Chủ sở hữu, người đại diện theo pháp luật, người quản lý, người lao động, cộng tác viên và các tổ chức, cá nhân hoạt động nhân danh Công ty có trách nhiệm tuân thủ quy định của pháp luật về phòng, chống tham nhũng, Điều lệ này và các quy chế nội bộ của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Mọi hoạt động của Công ty phải được thực hiện trên cơ sở công bằng, minh bạch và vì lợi ích hợp pháp của Công ty."}</P>
      <H3>{"Điều 101. Hành vi bị nghiêm cấm"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty nghiêm cấm mọi hành vi tham nhũng, bao gồm nhưng không giới hạn:"}</P>
      <P style={{marginLeft:28}}>{"a) Đưa hối lộ, nhận hối lộ hoặc môi giới hối lộ;"}</P>
      <P style={{marginLeft:28}}>{"b) Lợi dụng chức vụ, quyền hạn hoặc nhiệm vụ được giao nhằm thu lợi bất chính;"}</P>
      <P style={{marginLeft:28}}>{"c) Biển thủ, chiếm đoạt, sử dụng trái phép tài sản hoặc nguồn lực của Công ty;"}</P>
      <P style={{marginLeft:28}}>{"d) Gian lận trong quản lý tài chính, kế toán, thuế hoặc các hoạt động kinh doanh;"}</P>
      <P style={{marginLeft:28}}>{"đ) Cố ý che giấu, làm sai lệch thông tin, chứng từ hoặc hồ sơ nhằm phục vụ mục đích trái pháp luật;"}</P>
      <P style={{marginLeft:28}}>{"e) Các hành vi khác bị pháp luật cấm."}</P>
      <P style={{marginLeft:14}}>{"2.  Không cá nhân nào được nhân danh Công ty để thực hiện hoặc tạo điều kiện cho hành vi tham nhũng."}</P>
      <H3>{"Điều 102. Quà tặng, tài trợ và các lợi ích khác"}</H3>
      <P style={{marginLeft:14}}>{"1.  Việc tặng, nhận quà, tài trợ, chiêu đãi hoặc các lợi ích khác trong hoạt động của Công ty phải bảo đảm:"}</P>
      <P style={{marginLeft:28}}>{"a) Tuân thủ quy định của pháp luật;"}</P>
      <P style={{marginLeft:28}}>{"b) Phù hợp với tập quán thương mại hợp pháp;"}</P>
      <P style={{marginLeft:28}}>{"c) Không nhằm tác động không phù hợp đến việc ra quyết định hoặc thực hiện nhiệm vụ."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty có quyền ban hành quy chế nội bộ quy định về việc quản lý quà tặng, chiêu đãi, tài trợ và các lợi ích khác."}</P>
      <P style={{marginLeft:14}}>{"3.  Cá nhân có trách nhiệm báo cáo các trường hợp có khả năng dẫn đến xung đột lợi ích hoặc vi phạm quy định của Chương này."}</P>
      <H3>{"Điều 103. Minh bạch và kiểm soát nội bộ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty xây dựng hệ thống quản lý tài chính, kế toán, kiểm soát nội bộ và lưu trữ hồ sơ nhằm bảo đảm tính trung thực, đầy đủ và minh bạch của các giao dịch."}</P>
      <P style={{marginLeft:14}}>{"2.  Mọi khoản thu, chi, thanh toán, ký kết hợp đồng và giao dịch của Công ty phải được ghi nhận đầy đủ theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty khuyến khích áp dụng các biện pháp quản trị nhằm hạn chế nguy cơ phát sinh tham nhũng và gian lận."}</P>
      <H3>{"Điều 104. Báo cáo và bảo vệ người báo cáo"}</H3>
      <P style={{marginLeft:14}}>{"1.  Cá nhân phát hiện hoặc có căn cứ hợp lý để nghi ngờ có hành vi tham nhũng hoặc vi phạm quy định của Chương này có trách nhiệm thông báo cho người có thẩm quyền trong Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty xây dựng cơ chế tiếp nhận, xác minh và xử lý thông tin về hành vi tham nhũng một cách khách quan, kịp thời và đúng quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty có trách nhiệm bảo vệ người báo cáo thiện chí khỏi các hành vi trả đũa, phân biệt đối xử hoặc gây bất lợi trái pháp luật."}</P>
      <H3>{"Điều 105. Xử lý vi phạm"}</H3>
      <P style={{marginLeft:14}}>{"1.  Cá nhân có hành vi vi phạm quy định của Chương này phải chịu trách nhiệm theo quy định của pháp luật, Điều lệ, hợp đồng và các quy chế nội bộ của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Trường hợp hành vi có dấu hiệu vi phạm pháp luật hình sự hoặc pháp luật chuyên ngành, Công ty thực hiện các biện pháp phù hợp theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Việc xử lý vi phạm phải bảo đảm khách quan, công bằng, minh bạch và đúng trình tự, thủ tục theo quy định của pháp luật."}</P>
      <H3>{"Điều 106. Văn hóa liêm chính và phòng ngừa tham nhũng"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty xây dựng và duy trì văn hóa liêm chính, trách nhiệm, minh bạch và tuân thủ trong mọi hoạt động."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty khuyến khích đào tạo, phổ biến kiến thức và nâng cao nhận thức về phòng, chống tham nhũng cho người quản lý, người lao động và các cá nhân có liên quan."}</P>
      <P style={{marginLeft:14}}>{"3.  Chủ sở hữu có quyền ban hành hoặc sửa đổi các quy chế nội bộ về phòng, chống tham nhũng nhằm phù hợp với quy định của pháp luật và yêu cầu quản trị của Công ty."}</P>
      <H2 id="dieu-le-chuong-14">{"CHƯƠNG XIV. GIẢI QUYẾT TRANH CHẤP"}</H2>
      <H3>{"Điều 107. Nguyên tắc giải quyết tranh chấp"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty ưu tiên giải quyết các tranh chấp trên cơ sở thiện chí, hợp tác, bình đẳng, trung thực và tôn trọng quyền, lợi ích hợp pháp của các bên."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc giải quyết tranh chấp phải bảo đảm tuân thủ quy định của pháp luật, Điều lệ này, hợp đồng và các thỏa thuận hợp pháp giữa các bên."}</P>
      <P style={{marginLeft:14}}>{"3.  Trong quá trình giải quyết tranh chấp, các bên có trách nhiệm hạn chế tối đa thiệt hại và không được thực hiện các hành vi làm cản trở hoặc gây ảnh hưởng trái pháp luật đến hoạt động của Công ty."}</P>
      <H3>{"Điều 108. Phạm vi tranh chấp"}</H3>
      <P>{"Các tranh chấp có thể được giải quyết theo quy định của Chương này bao gồm nhưng không giới hạn:"}</P>
      <P style={{marginLeft:28}}>{"a) Tranh chấp giữa Công ty với Chủ sở hữu;"}</P>
      <P style={{marginLeft:28}}>{"b) Tranh chấp giữa Công ty với người quản lý, người lao động hoặc cộng tác viên;"}</P>
      <P style={{marginLeft:28}}>{"c) Tranh chấp phát sinh từ hợp đồng hoặc giao dịch của Công ty;"}</P>
      <P style={{marginLeft:28}}>{"d) Tranh chấp liên quan đến tài sản, tài sản số, dữ liệu, sở hữu trí tuệ, bí mật kinh doanh hoặc công nghệ;"}</P>
      <P style={{marginLeft:28}}>{"đ) Tranh chấp với khách hàng, đối tác hoặc tổ chức, cá nhân khác;"}</P>
      <P style={{marginLeft:28}}>{"e) Các tranh chấp khác thuộc phạm vi hoạt động của Công ty."}</P>
      <H3>{"Điều 109. Thương lượng và hòa giải"}</H3>
      <P style={{marginLeft:14}}>{"1.  Khi phát sinh tranh chấp, các bên ưu tiên giải quyết thông qua thương lượng trên tinh thần thiện chí và hợp tác."}</P>
      <P style={{marginLeft:14}}>{"2.  Trường hợp thương lượng không đạt kết quả, các bên có thể thống nhất lựa chọn hòa giải theo quy định của pháp luật hoặc theo thỏa thuận giữa các bên."}</P>
      <P style={{marginLeft:14}}>{"3.  Việc thương lượng hoặc hòa giải không làm mất quyền yêu cầu cơ quan có thẩm quyền giải quyết tranh chấp theo quy định của pháp luật."}</P>
      <H3>{"Điều 110. Giải quyết bằng trọng tài hoặc Tòa án"}</H3>
      <P style={{marginLeft:14}}>{"1.  Trường hợp tranh chấp không được giải quyết thông qua thương lượng hoặc hòa giải, tranh chấp được giải quyết bằng Trọng tài hoặc Tòa án có thẩm quyền theo quy định của pháp luật hoặc theo thỏa thuận hợp pháp giữa các bên."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc lựa chọn Trọng tài hoặc Tòa án được thực hiện theo quy định của pháp luật và nội dung của hợp đồng hoặc thỏa thuận có liên quan."}</P>
      <P style={{marginLeft:14}}>{"3.  Quyết định, bản án hoặc phán quyết có hiệu lực pháp luật là cơ sở để các bên thực hiện quyền và nghĩa vụ của mình theo quy định của pháp luật."}</P>
      <H3>{"Điều 111. Luật áp dụng"}</H3>
      <P style={{marginLeft:14}}>{"1.  Đối với các tranh chấp phát sinh trong hoạt động của Công ty tại Việt Nam, pháp luật Việt Nam là luật áp dụng, trừ trường hợp pháp luật hoặc điều ước quốc tế mà Việt Nam là thành viên có quy định khác."}</P>
      <P style={{marginLeft:14}}>{"2.  Đối với tranh chấp có yếu tố nước ngoài, việc xác định luật áp dụng được thực hiện theo quy định của pháp luật Việt Nam, điều ước quốc tế mà Việt Nam là thành viên hoặc theo thỏa thuận hợp pháp giữa các bên."}</P>
      <H3>{"Điều 112. Bảo mật trong quá trình giải quyết tranh chấp"}</H3>
      <P style={{marginLeft:14}}>{"1.  Các bên có trách nhiệm bảo mật thông tin, tài liệu và dữ liệu liên quan đến tranh chấp, trừ trường hợp pháp luật quy định phải công khai hoặc các bên có thỏa thuận khác."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc cung cấp thông tin cho cơ quan nhà nước có thẩm quyền, Trọng tài hoặc Tòa án được thực hiện theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty có trách nhiệm bảo vệ bí mật kinh doanh, bí mật công nghệ, dữ liệu, tài sản trí tuệ và các thông tin được pháp luật bảo vệ trong quá trình giải quyết tranh chấp."}</P>
      <H3>{"Điều 113. Thi hành kết quả giải quyết tranh chấp"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty, Chủ sở hữu và các cá nhân, tổ chức có liên quan có trách nhiệm thực hiện đầy đủ các bản án, quyết định hoặc phán quyết đã có hiệu lực pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Trường hợp phát sinh nghĩa vụ khắc phục, bồi thường hoặc thực hiện các biện pháp khác theo quyết định của cơ quan có thẩm quyền, Công ty và các bên liên quan có trách nhiệm thực hiện theo đúng quy định của pháp luật."}</P>
      <H3>{"Điều 114. Hoàn thiện cơ chế giải quyết tranh chấp"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty khuyến khích xây dựng cơ chế phòng ngừa tranh chấp thông qua quản trị minh bạch, kiểm soát nội bộ, quản trị rủi ro và quản trị tuân thủ."}</P>
      <P style={{marginLeft:14}}>{"2.  Chủ sở hữu có quyền ban hành hoặc sửa đổi các quy chế nội bộ về giải quyết khiếu nại, tranh chấp và xử lý vi phạm nhằm nâng cao hiệu quả quản trị của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty khuyến khích áp dụng các phương thức giải quyết tranh chấp hiện đại, hiệu quả và phù hợp với quy định của pháp luật nhằm bảo vệ quyền và lợi ích hợp pháp của Công ty cũng như các bên liên quan."}</P>
      <H2 id="dieu-le-chuong-15">{"CHƯƠNG XV. ĐIỀU KHOẢN CHUYỂN TIẾP"}</H2>
      <H3>{"Điều 115. Hiệu lực của Điều lệ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Điều lệ này được Chủ sở hữu thông qua và có hiệu lực kể từ ngày Công ty được cấp Giấy chứng nhận đăng ký doanh nghiệp, trừ trường hợp Điều lệ hoặc pháp luật có quy định khác."}</P>
      <P style={{marginLeft:14}}>{"2.  Điều lệ này là văn bản quản trị nội bộ có giá trị pháp lý cao nhất của Công ty sau các quy định bắt buộc của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Chủ sở hữu, Người đại diện theo pháp luật, người quản lý, người lao động và các tổ chức, cá nhân có liên quan có trách nhiệm tuân thủ Điều lệ này trong phạm vi quyền, nghĩa vụ và trách nhiệm của mình."}</P>
      <H3>{"Điều 116. Áp dụng pháp luật"}</H3>
      <P style={{marginLeft:14}}>{"1.  Những vấn đề chưa được quy định trong Điều lệ này được thực hiện theo quy định của pháp luật Việt Nam."}</P>
      <P style={{marginLeft:14}}>{"2.  Trường hợp quy định của Điều lệ này khác với quy định bắt buộc của pháp luật thì áp dụng quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Trường hợp pháp luật được sửa đổi, bổ sung hoặc thay thế sau khi Điều lệ này có hiệu lực thì Công ty áp dụng các quy định pháp luật mới có hiệu lực bắt buộc và tiến hành sửa đổi, bổ sung Điều lệ khi cần thiết."}</P>
      <H3>{"Điều 117. Sửa đổi, bổ sung Điều lệ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Chủ sở hữu có quyền quyết định việc sửa đổi, bổ sung hoặc thay thế Điều lệ theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc sửa đổi, bổ sung Điều lệ phải được lập thành văn bản, ghi rõ nội dung sửa đổi và thời điểm có hiệu lực."}</P>
      <P style={{marginLeft:14}}>{"3.  Sau khi Điều lệ được sửa đổi, bổ sung, Công ty có trách nhiệm thực hiện các thủ tục theo quy định của pháp luật nếu việc sửa đổi thuộc trường hợp phải đăng ký hoặc thông báo với cơ quan nhà nước có thẩm quyền."}</P>
      <H3>{"Điều 118. Giá trị pháp lý của Điều lệ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Điều lệ này là căn cứ để tổ chức và quản lý hoạt động của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Các quy chế, quy định, quy trình và văn bản nội bộ của Công ty phải phù hợp với Điều lệ này và quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Trường hợp có sự khác nhau giữa Điều lệ và các văn bản quản trị nội bộ của Công ty thì áp dụng Điều lệ, trừ trường hợp pháp luật có quy định khác."}</P>
      <H3>{"Điều 119. Điều khoản chuyển tiếp"}</H3>
      <P style={{marginLeft:14}}>{"1.  Các quyền, nghĩa vụ, hợp đồng, giao dịch, tài sản, dữ liệu, tài sản số, quyền sở hữu trí tuệ, hồ sơ, giấy phép và các quan hệ pháp lý được xác lập hợp pháp trước thời điểm Điều lệ này có hiệu lực tiếp tục được công nhận và thực hiện theo quy định của pháp luật và các thỏa thuận hợp pháp đã được xác lập."}</P>
      <P style={{marginLeft:14}}>{"2.  Các quy chế, quy định và quy trình nội bộ đã được ban hành trước ngày Điều lệ này có hiệu lực tiếp tục được áp dụng trong phạm vi không trái với Điều lệ này và quy định của pháp luật cho đến khi được sửa đổi, bổ sung hoặc thay thế."}</P>
      <P style={{marginLeft:14}}>{"3.  Trong thời gian chưa ban hành đầy đủ các quy chế nội bộ để triển khai Điều lệ này, Chủ sở hữu hoặc Người đại diện theo pháp luật có quyền ban hành các quyết định cần thiết nhằm bảo đảm hoạt động liên tục, ổn định và đúng quy định của pháp luật."}</P>
      <H3>{"Điều 120. Cam kết thực hiện Điều lệ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Chủ sở hữu cam kết tổ chức quản lý và điều hành Công ty theo đúng quy định của pháp luật và Điều lệ này."}</P>
      <P style={{marginLeft:14}}>{"2.  Người đại diện theo pháp luật, người quản lý, người lao động và các cá nhân có liên quan có trách nhiệm thực hiện đầy đủ các quy định của Điều lệ trong phạm vi nhiệm vụ, quyền hạn và trách nhiệm của mình."}</P>
      <P style={{marginLeft:14}}>{"3.  Điều lệ này được lập bằng tiếng Việt. Trường hợp Công ty ban hành bản dịch sang ngôn ngữ khác để phục vụ hoạt động kinh doanh hoặc hợp tác quốc tế thì bản tiếng Việt là bản có giá trị pháp lý, trừ trường hợp pháp luật hoặc thỏa thuận hợp pháp giữa các bên có quy định khác."}</P>
      <H2 id="dieu-le-chuong-16">{"CHƯƠNG XVI. ĐIỀU KHOẢN THI HÀNH"}</H2>
      <H3>{"Điều 121. Hiệu lực thi hành"}</H3>
      <P style={{marginLeft:14}}>{"1.  Điều lệ này được Chủ sở hữu thông qua theo đúng quy định của pháp luật và có hiệu lực kể từ ngày Công ty được cấp Giấy chứng nhận đăng ký doanh nghiệp hoặc từ thời điểm khác do Chủ sở hữu quyết định, nếu pháp luật cho phép."}</P>
      <P style={{marginLeft:14}}>{"2.  Kể từ thời điểm Điều lệ này có hiệu lực, các quy định trước đây của Công ty trái với Điều lệ này hết hiệu lực trong phạm vi có sự khác biệt."}</P>
      <P style={{marginLeft:14}}>{"3.  Việc sửa đổi, bổ sung hoặc thay thế Điều lệ được thực hiện theo quy định của pháp luật và Điều lệ này."}</P>
      <H3>{"Điều 122. Tổ chức thực hiện"}</H3>
      <P style={{marginLeft:14}}>{"1.  Chủ sở hữu chịu trách nhiệm tổ chức việc thực hiện Điều lệ này."}</P>
      <P style={{marginLeft:14}}>{"2.  Người đại diện theo pháp luật có trách nhiệm:"}</P>
      <P style={{marginLeft:28}}>{"a) Tổ chức triển khai Điều lệ trong toàn Công ty;"}</P>
      <P style={{marginLeft:28}}>{"b) Ban hành hoặc trình Chủ sở hữu ban hành các quy chế, quy trình và văn bản quản trị nội bộ nhằm thực hiện Điều lệ;"}</P>
      <P style={{marginLeft:28}}>{"c) Kiểm tra và giám sát việc thực hiện Điều lệ trong phạm vi thẩm quyền của mình."}</P>
      <P style={{marginLeft:14}}>{"3.  Người quản lý, người lao động, cộng tác viên và các tổ chức, cá nhân có liên quan có trách nhiệm thực hiện đầy đủ các quy định của Điều lệ và các văn bản quản trị nội bộ của Công ty."}</P>
      <H3>{"Điều 123. Ban hành văn bản quản trị nội bộ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Để triển khai Điều lệ, Chủ sở hữu có quyền ban hành các quy chế, quy định, quy trình, chính sách, hướng dẫn và các văn bản quản trị nội bộ khác phù hợp với quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Các văn bản quản trị nội bộ phải phù hợp với Điều lệ này và không được trái với quy định bắt buộc của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Trường hợp cần thiết, Chủ sở hữu có quyền sửa đổi, bổ sung, thay thế hoặc bãi bỏ các văn bản quản trị nội bộ nhằm đáp ứng yêu cầu quản trị và hoạt động của Công ty."}</P>
      <H3>{"Điều 124. Lưu giữ Điều lệ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Điều lệ được lưu giữ tại trụ sở chính của Công ty theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Chủ sở hữu, Người đại diện theo pháp luật và các cá nhân có thẩm quyền được quyền tiếp cận, sử dụng Điều lệ phục vụ hoạt động quản trị, điều hành và thực hiện quyền, nghĩa vụ của mình."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty có thể lưu giữ Điều lệ dưới hình thức giấy, điện tử hoặc các hình thức lưu trữ hợp pháp khác, bảo đảm tính toàn vẹn, khả năng truy cập và giá trị pháp lý theo quy định của pháp luật."}</P>
      <H3>{"Điều 125. Ngôn ngữ và bản Điều lệ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Điều lệ chính thức của Công ty được lập bằng tiếng Việt."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty có thể dịch Điều lệ sang một hoặc nhiều ngôn ngữ khác để phục vụ hoạt động quản trị, hợp tác quốc tế hoặc hoạt động kinh doanh."}</P>
      <P style={{marginLeft:14}}>{"3.  Trường hợp có sự khác nhau giữa bản tiếng Việt và bản dịch, bản tiếng Việt được ưu tiên áp dụng, trừ trường hợp pháp luật hoặc thỏa thuận hợp pháp giữa các bên có quy định khác."}</P>
      <H3>{"Điều 126. Cam kết thực hiện"}</H3>
      <P style={{marginLeft:14}}>{"1.  Chủ sở hữu cam kết thực hiện đầy đủ các quyền và nghĩa vụ theo quy định của pháp luật và Điều lệ này."}</P>
      <P style={{marginLeft:14}}>{"2.  Người đại diện theo pháp luật, người quản lý, người lao động và các cá nhân có liên quan có trách nhiệm tuân thủ Điều lệ, các quy chế nội bộ và các quy định của pháp luật trong quá trình thực hiện nhiệm vụ."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty khuyến khích xây dựng văn hóa quản trị dựa trên các nguyên tắc: a) Tuân thủ pháp luật; b) Liêm chính; c) Minh bạch; d) Trách nhiệm; đ) Hiệu quả; e) Đổi mới sáng tạo; g) Phát triển bền vững."}</P>
      <P style={{marginLeft:14}}>{"4.  Điều lệ này gồm "}<Strong>{"16 Chương và 126 Điều"}</Strong>{", là căn cứ pháp lý nội bộ để tổ chức, quản trị và điều hành mọi hoạt động của Công ty theo quy định của pháp luật."}</P>
      <P>{"Cần Thơ, ngày ........ tháng ........ năm 2026"}</P>
      <P><Strong>{"CHỦ SỞ HỮU"}</Strong></P>
      <P>{"*(Ký, ghi rõ họ tên)*"}</P>
      <P><Strong>{"LÊ BÍCH NGƯNG"}</Strong></P>
      <HR/>

      <H2>Data, Technology and Digital Assets Governance Regulations</H2>
      <H3 style={{ color: "var(--text)", fontStyle: "normal" }}>Table of Contents</H3>
      <UL>
<li><A href="#quy-che-chuong-1">{"PHẦN MỞ ĐẦU"}</A></li>
      <li><A href="#quy-che-chuong-2">{"Phần I. QUẢN TRỊ DỮ LIỆU"}</A></li>
      <li><A href="#quy-che-chuong-3">{"Phần II. TÀI SẢN SỐ"}</A></li>
      <li><A href="#quy-che-chuong-4">{"Phần III. SỞ HỮU TRÍ TUỆ"}</A></li>
      <li><A href="#quy-che-chuong-5">{"Phần IV. TRÍ TUỆ NHÂN TẠO (AI) VÀ PHẦN MỀM"}</A></li>
      <li><A href="#quy-che-chuong-6">{"Phần V. AN TOÀN THÔNG TIN"}</A></li>      </UL>

      <HR/>

<H2 id="quy-che-chuong-1">{"PHẦN MỞ ĐẦU"}</H2>
      <P>{"Quy chế này quy định các nguyên tắc quản trị nền tảng về dữ liệu, tài sản số, sở hữu trí tuệ, trí tuệ nhân tạo (AI), phần mềm và an toàn thông tin của Công ty Trách nhiệm hữu hạn một thành viên QUERENCIA, cụ thể hóa Điều 56 Điều lệ Công ty. Quy chế này là một bộ phận không tách rời của hệ thống văn bản quản trị nội bộ Công ty, phải phù hợp với Điều lệ Công ty và quy định của pháp luật hiện hành; trường hợp có sự khác biệt, Điều lệ Công ty và pháp luật được ưu tiên áp dụng. Các yêu cầu triển khai cụ thể được quy định tại các văn bản triển khai theo nguyên tắc tại Điều 1 Quy chế này."}</P>
      <H2 id="quy-che-chuong-2">{"Phần I. QUẢN TRỊ DỮ LIỆU"}</H2>
      <H3>{"Điều 1. Nguyên tắc và phạm vi điều chỉnh của Quy chế"}</H3>
      <P style={{marginLeft:14}}>{"1.  Quy chế này chỉ quy định các nguyên tắc quản trị nền tảng về dữ liệu, tài sản số, sở hữu trí tuệ, trí tuệ nhân tạo (AI), phần mềm và an toàn thông tin của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Các yêu cầu triển khai cụ thể về công nghệ, an toàn thông tin, AI, dữ liệu, tiêu chuẩn kỹ thuật, cấu hình hệ thống, quy trình vận hành và các nội dung khác có khả năng thay đổi thường xuyên theo sự phát triển của công nghệ được quy định tại các chính sách (Policy), tiêu chuẩn (Standard), quy trình (SOP) hoặc văn bản nội bộ khác do Công ty ban hành theo từng thời kỳ (sau đây gọi chung là \"văn bản triển khai\")."}</P>
      <P style={{marginLeft:14}}>{"3.  Văn bản triển khai do Chủ sở hữu, Người đại diện theo pháp luật hoặc người được ủy quyền ban hành, sửa đổi, bổ sung hoặc thay thế phù hợp với nhu cầu quản trị và sự phát triển của công nghệ theo từng thời kỳ, mà không cần sửa đổi Quy chế này, miễn là không trái với Quy chế này, Điều lệ Công ty và quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"4.  Quy chế này không gắn với bất kỳ nền tảng công nghệ, phần mềm, mô hình AI, nhà cung cấp dịch vụ hoặc tiêu chuẩn kỹ thuật cụ thể nào; việc lựa chọn công nghệ, nền tảng hoặc nhà cung cấp phù hợp theo từng thời kỳ được thực hiện theo văn bản triển khai và quyết định của Công ty."}</P>
      <P style={{marginLeft:14}}>{"5.  Trường hợp văn bản triển khai trái với Quy chế này, Điều lệ Công ty hoặc quy định của pháp luật, Quy chế này, Điều lệ Công ty và quy định của pháp luật được ưu tiên áp dụng."}</P>
      <H3>{"Điều 2. Nguyên tắc quản trị dữ liệu"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty xác định dữ liệu là một trong những tài sản quan trọng của doanh nghiệp và có trách nhiệm quản lý, bảo vệ, khai thác và sử dụng dữ liệu một cách hợp pháp, an toàn và hiệu quả."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc thu thập, lưu trữ, xử lý, chia sẻ, sử dụng và hủy dữ liệu phải tuân thủ quy định của pháp luật, Điều lệ Công ty và các quy chế nội bộ."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty xây dựng hệ thống quản trị dữ liệu nhằm bảo đảm tính chính xác, đầy đủ, toàn vẹn, bảo mật, khả năng truy xuất và tính sẵn sàng của dữ liệu."}</P>
      <H3>{"Điều 3. Phân loại dữ liệu"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty thực hiện phân loại dữ liệu theo tính chất, mục đích sử dụng và mức độ bảo mật."}</P>
      <P style={{marginLeft:14}}>{"2.  Dữ liệu của Công ty bao gồm nhưng không giới hạn: a) Dữ liệu quản trị doanh nghiệp; b) Dữ liệu tài chính, kế toán và thuế; c) Dữ liệu khách hàng; d) Dữ liệu người lao động; đ) Dữ liệu đối tác; e) Dữ liệu sản phẩm, dịch vụ và hệ thống công nghệ; g) Dữ liệu nghiên cứu và phát triển; h) Dữ liệu sở hữu trí tuệ; i) Các loại dữ liệu khác theo quy định của pháp luật hoặc theo nhu cầu quản trị."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty có thể ban hành quy chế phân loại dữ liệu và quy định mức độ bảo mật đối với từng loại dữ liệu."}</P>
      <H3>{"Điều 4. Thu thập và sử dụng dữ liệu"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty chỉ thu thập và xử lý dữ liệu trên cơ sở hợp pháp, minh bạch và đúng mục đích."}</P>
      <P style={{marginLeft:14}}>{"2.  Dữ liệu chỉ được sử dụng trong phạm vi cần thiết để phục vụ hoạt động của Công ty hoặc theo sự đồng ý của chủ thể dữ liệu, trừ trường hợp pháp luật có quy định khác."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty không được sử dụng dữ liệu trái pháp luật, trái đạo đức xã hội hoặc xâm phạm quyền và lợi ích hợp pháp của tổ chức, cá nhân."}</P>
      <H3>{"Điều 5. Bảo vệ dữ liệu"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty áp dụng các biện pháp quản trị, tổ chức và kỹ thuật phù hợp nhằm bảo vệ dữ liệu trước các rủi ro như mất mát, thất thoát, truy cập trái phép, sửa đổi trái phép, phá hoại hoặc tiết lộ trái phép."}</P>
      <P style={{marginLeft:14}}>{"2.  Người lao động, người quản lý và các cá nhân được giao quyền truy cập dữ liệu có trách nhiệm bảo mật thông tin và chỉ sử dụng dữ liệu trong phạm vi nhiệm vụ được giao."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty có thể áp dụng các giải pháp sao lưu, phục hồi dữ liệu, kiểm soát truy cập, ghi nhật ký hệ thống và các biện pháp bảo mật khác phù hợp với quy mô hoạt động."}</P>
      <H3>{"Điều 6. Quyền truy cập dữ liệu"}</H3>
      <P style={{marginLeft:14}}>{"1.  Quyền truy cập dữ liệu được phân cấp theo chức năng, nhiệm vụ và thẩm quyền của từng cá nhân hoặc bộ phận."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc cấp, thay đổi hoặc thu hồi quyền truy cập dữ liệu được thực hiện theo quy chế nội bộ của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Mọi hoạt động truy cập, chỉnh sửa, sao chép hoặc xóa dữ liệu có thể được ghi nhận để phục vụ công tác quản trị, kiểm tra và bảo đảm an toàn thông tin."}</P>
      <H3>{"Điều 7. Chia sẻ và chuyển giao dữ liệu"}</H3>
      <P style={{marginLeft:14}}>{"1.  Việc chia sẻ hoặc chuyển giao dữ liệu cho tổ chức, cá nhân khác chỉ được thực hiện khi: a) Có căn cứ pháp luật; b) Có sự đồng ý của chủ thể dữ liệu trong trường hợp pháp luật yêu cầu; c) Phục vụ hoạt động hợp pháp của Công ty; d) Theo quyết định của cơ quan nhà nước có thẩm quyền hoặc theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty thực hiện các biện pháp phù hợp nhằm bảo đảm an toàn dữ liệu trong quá trình chia sẻ hoặc chuyển giao."}</P>
      <H3>{"Điều 8. Lưu trữ và hủy dữ liệu"}</H3>
      <P style={{marginLeft:14}}>{"1.  Dữ liệu được lưu trữ trong thời hạn theo quy định của pháp luật hoặc theo nhu cầu quản trị của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Hết thời hạn lưu trữ hoặc khi không còn mục đích sử dụng hợp pháp, dữ liệu được hủy hoặc ẩn danh theo quy định của pháp luật và quy chế nội bộ."}</P>
      <P style={{marginLeft:14}}>{"3.  Việc hủy dữ liệu phải bảo đảm không làm ảnh hưởng đến quyền và lợi ích hợp pháp của tổ chức, cá nhân có liên quan."}</P>
      <H3>{"Điều 9. Quản trị rủi ro dữ liệu"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty xây dựng cơ chế nhận diện, đánh giá, phòng ngừa và ứng phó với các rủi ro liên quan đến dữ liệu."}</P>
      <P style={{marginLeft:14}}>{"2.  Khi xảy ra sự cố về dữ liệu, Công ty có trách nhiệm thực hiện các biện pháp cần thiết nhằm hạn chế thiệt hại, khôi phục hoạt động và thực hiện các nghĩa vụ theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty khuyến khích việc đánh giá định kỳ hệ thống quản trị dữ liệu nhằm nâng cao mức độ an toàn, hiệu quả và khả năng thích ứng với sự phát triển của công nghệ."}</P>
      <H3>{"Điều 10. Phát triển và quản trị dữ liệu trong tương lai"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty khuyến khích ứng dụng các công nghệ mới trong quản trị dữ liệu nhằm nâng cao hiệu quả hoạt động, chất lượng dịch vụ và năng lực cạnh tranh."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc ứng dụng các công nghệ mới trong quản trị dữ liệu, theo từng thời kỳ, phải tuân thủ pháp luật và các nguyên tắc quản trị của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Chủ sở hữu có quyền ban hành hoặc sửa đổi các quy chế nội bộ về quản trị dữ liệu để phù hợp với quy định của pháp luật, sự phát triển của công nghệ và nhu cầu hoạt động của Công ty."}</P>
      <H2 id="quy-che-chuong-3">{"Phần II. TÀI SẢN SỐ"}</H2>
      <H3>{"Điều 11. Nguyên tắc quản lý tài sản số"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty xác định tài sản số là một bộ phận của tài sản doanh nghiệp và thực hiện việc quản lý, sử dụng, bảo vệ, khai thác và định đoạt theo quy định của pháp luật, Quy chế này, Điều lệ Công ty và các văn bản triển khai của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc tạo lập, mua, nhận chuyển nhượng, cấp phép sử dụng, khai thác, chuyển giao hoặc chấm dứt quyền đối với tài sản số phải bảo đảm tính hợp pháp, minh bạch và phục vụ lợi ích của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Tài sản số của Công ty được quản lý độc lập với tài sản số của Chủ sở hữu, người lao động và các tổ chức, cá nhân khác."}</P>
      <H3>{"Điều 12. Phạm vi tài sản số"}</H3>
      <P style={{marginLeft:14}}>{"1.  Tài sản số của Công ty có thể bao gồm nhưng không giới hạn:"}</P>
      <P style={{marginLeft:28}}>{"a) Tên miền Internet;"}</P>
      <P style={{marginLeft:28}}>{"b) Website, ứng dụng, nền tảng số và dịch vụ trực tuyến;"}</P>
      <P style={{marginLeft:28}}>{"c) Mã nguồn, phần mềm, chương trình máy tính và thư viện phần mềm;"}</P>
      <P style={{marginLeft:28}}>{"d) Cơ sở dữ liệu và dữ liệu thuộc quyền quản lý hợp pháp của Công ty;"}</P>
      <P style={{marginLeft:28}}>{"đ) Mô hình trí tuệ nhân tạo, thuật toán, mô hình học máy và các tài sản công nghệ tương tự;"}</P>
      <P style={{marginLeft:28}}>{"e) Tài khoản trên các nền tảng trực tuyến, tài khoản dịch vụ số và tài khoản phục vụ hoạt động của Công ty;"}</P>
      <P style={{marginLeft:28}}>{"g) Quyền sở hữu trí tuệ hoặc quyền khai thác hợp pháp đối với các sản phẩm số;"}</P>
      <P style={{marginLeft:28}}>{"h) Giấy phép phần mềm, giấy phép công nghệ và các quyền sử dụng tài sản số khác;"}</P>
      <P style={{marginLeft:28}}>{"i) Tài sản số khác được pháp luật công nhận hoặc thuộc quyền sở hữu, quyền sử dụng hợp pháp của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Danh mục tài sản số được cập nhật theo quá trình hoạt động của Công ty và quy định của pháp luật."}</P>
      <H3>{"Điều 13. Quyền sở hữu và quyền sử dụng"}</H3>
      <P style={{marginLeft:14}}>{"1.  Mọi tài sản số được tạo lập, mua sắm hoặc nhận chuyển giao bằng nguồn lực của Công ty, hoặc được tạo ra trong quá trình thực hiện nhiệm vụ cho Công ty theo quy định của pháp luật, thuộc quyền sở hữu hoặc quyền sử dụng hợp pháp của Công ty, trừ trường hợp pháp luật hoặc hợp đồng có quy định khác."}</P>
      <P style={{marginLeft:14}}>{"2.  Người lao động, cộng tác viên, nhà thầu hoặc đối tác có trách nhiệm chuyển giao tài sản số thuộc phạm vi quyền của Công ty theo hợp đồng hoặc theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Việc sử dụng tài sản số phải đúng mục đích, đúng thẩm quyền và bảo đảm lợi ích của Công ty."}</P>
      <H3>{"Điều 14. Bảo vệ tài sản số"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty áp dụng các biện pháp quản trị, kỹ thuật và tổ chức phù hợp nhằm bảo vệ tài sản số khỏi mất mát, truy cập trái phép, sửa đổi, phá hủy hoặc sử dụng trái phép."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty thực hiện phân quyền truy cập, quản lý tài khoản, sao lưu dữ liệu, kiểm soát thay đổi và các biện pháp cần thiết khác để bảo đảm an toàn tài sản số."}</P>
      <P style={{marginLeft:14}}>{"3.  Mọi cá nhân được giao quản lý hoặc sử dụng tài sản số có trách nhiệm bảo mật và bảo vệ tài sản số theo quy định của pháp luật và quy chế nội bộ."}</P>
      <H3>{"Điều 15. Khai thác và thương mại hóa tài sản số"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty có quyền khai thác, cấp phép sử dụng, cho thuê, chuyển nhượng, hợp tác khai thác hoặc thực hiện các giao dịch hợp pháp khác đối với tài sản số nhằm phục vụ hoạt động kinh doanh."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc khai thác tài sản số phải bảo đảm: a) Tuân thủ pháp luật; b) Không xâm phạm quyền và lợi ích hợp pháp của tổ chức, cá nhân khác; c) Bảo đảm lợi ích lâu dài của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Chủ sở hữu quyết định hoặc phân cấp quyết định đối với các giao dịch liên quan đến tài sản số theo quy chế nội bộ của Công ty."}</P>
      <H3>{"Điều 16. Định giá tài sản số"}</H3>
      <P style={{marginLeft:14}}>{"1.  Khi cần thiết, tài sản số có thể được định giá để phục vụ hoạt động đầu tư, góp vốn, mua bán, sáp nhập, chuyển nhượng, cấp phép hoặc các mục đích hợp pháp khác."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc định giá tài sản số được thực hiện theo quy định của pháp luật, tiêu chuẩn chuyên môn hoặc thông lệ phù hợp với từng loại tài sản."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty có thể thuê tổ chức hoặc chuyên gia độc lập thực hiện việc định giá tài sản số khi cần thiết."}</P>
      <H3>{"Điều 17. Quản lý rủi ro đối với tài sản số"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty xây dựng cơ chế quản trị rủi ro nhằm bảo vệ tài sản số trước các rủi ro về công nghệ, an ninh mạng, gian lận, mất dữ liệu, tranh chấp quyền sở hữu trí tuệ và các rủi ro khác."}</P>
      <P style={{marginLeft:14}}>{"2.  Khi phát sinh sự cố liên quan đến tài sản số, Công ty thực hiện các biện pháp cần thiết để hạn chế thiệt hại, khôi phục hoạt động và bảo vệ quyền, lợi ích hợp pháp của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty định kỳ rà soát, đánh giá và cập nhật các biện pháp quản lý tài sản số nhằm phù hợp với sự phát triển của công nghệ và quy định của pháp luật."}</P>
      <H3>{"Điều 18. Phát triển tài sản số"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty khuyến khích đầu tư nghiên cứu, phát triển và tạo lập tài sản số nhằm nâng cao năng lực cạnh tranh và giá trị doanh nghiệp."}</P>
      <P style={{marginLeft:14}}>{"2.  Chủ sở hữu có quyền ban hành các quy chế nội bộ về quản lý, khai thác, bảo vệ và phát triển tài sản số phù hợp với quy định của pháp luật và chiến lược phát triển của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Trường hợp pháp luật Việt Nam hoặc điều ước quốc tế mà Việt Nam là thành viên có quy định mới về tài sản số, Công ty thực hiện theo các quy định đó và điều chỉnh quy chế nội bộ khi cần thiết."}</P>
      <H2 id="quy-che-chuong-4">{"Phần III. SỞ HỮU TRÍ TUỆ"}</H2>
      <H3>{"Điều 19. Nguyên tắc về sở hữu trí tuệ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty tôn trọng, bảo vệ và khai thác hợp pháp quyền sở hữu trí tuệ theo quy định của pháp luật Việt Nam, điều ước quốc tế mà Việt Nam là thành viên và các quy định pháp luật có liên quan."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty khuyến khích hoạt động nghiên cứu, sáng tạo, đổi mới công nghệ và phát triển tài sản trí tuệ nhằm nâng cao năng lực cạnh tranh và giá trị doanh nghiệp."}</P>
      <P style={{marginLeft:14}}>{"3.  Việc tạo lập, sử dụng, quản lý, khai thác, chuyển giao và bảo vệ quyền sở hữu trí tuệ phải bảo đảm tính hợp pháp, minh bạch và phục vụ lợi ích của Công ty."}</P>
      <H3>{"Điều 20. Đối tượng sở hữu trí tuệ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Quyền sở hữu trí tuệ của Công ty có thể bao gồm nhưng không giới hạn:"}</P>
      <P style={{marginLeft:28}}>{"a) Quyền tác giả và quyền liên quan;"}</P>
      <P style={{marginLeft:28}}>{"b) Chương trình máy tính, phần mềm, mã nguồn và tài liệu kỹ thuật;"}</P>
      <P style={{marginLeft:28}}>{"c) Nhãn hiệu, tên thương mại, tên miền và dấu hiệu nhận diện thương hiệu;"}</P>
      <P style={{marginLeft:28}}>{"d) Sáng chế, giải pháp hữu ích, kiểu dáng công nghiệp và thiết kế bố trí mạch tích hợp bán dẫn;"}</P>
      <P style={{marginLeft:28}}>{"đ) Bí mật kinh doanh, bí quyết kỹ thuật, quy trình công nghệ và phương pháp quản lý;"}</P>
      <P style={{marginLeft:28}}>{"e) Cơ sở dữ liệu, tài liệu nghiên cứu và kết quả nghiên cứu, phát triển;"}</P>
      <P style={{marginLeft:28}}>{"g) Quyền đối với giống cây trồng hoặc các đối tượng khác được pháp luật về sở hữu trí tuệ bảo hộ;"}</P>
      <P style={{marginLeft:28}}>{"h) Các đối tượng sở hữu trí tuệ khác theo quy định của pháp luật hoặc thuộc quyền sở hữu, quyền sử dụng hợp pháp của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Danh mục đối tượng sở hữu trí tuệ của Công ty được cập nhật theo quá trình hoạt động và quy định của pháp luật."}</P>
      <H3>{"Điều 21. Quyền sở hữu đối với kết quả lao động và sáng tạo"}</H3>
      <P style={{marginLeft:14}}>{"1.  Quyền sở hữu hoặc quyền sử dụng đối với các đối tượng sở hữu trí tuệ được tạo ra từ hoạt động của Công ty được xác định theo quy định của pháp luật và các thỏa thuận hợp pháp giữa Công ty với cá nhân, tổ chức có liên quan."}</P>
      <P style={{marginLeft:14}}>{"2.  Người lao động, người quản lý, cộng tác viên, nhà thầu hoặc đối tác có trách nhiệm thực hiện các nghĩa vụ liên quan đến quyền sở hữu trí tuệ theo hợp đồng đã ký kết và quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty có quyền yêu cầu các cá nhân, tổ chức có liên quan thực hiện thủ tục cần thiết nhằm xác lập, chuyển giao hoặc bảo vệ quyền sở hữu trí tuệ của Công ty theo quy định của pháp luật."}</P>
      <H3>{"Điều 22. Đăng ký và bảo hộ quyền sở hữu trí tuệ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty có quyền đăng ký xác lập quyền sở hữu trí tuệ đối với các đối tượng đủ điều kiện bảo hộ theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Chủ sở hữu quyết định việc đăng ký, gia hạn, duy trì, sửa đổi, chuyển nhượng, cấp phép hoặc chấm dứt quyền đối với các đối tượng sở hữu trí tuệ của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty có thể sử dụng dịch vụ của tổ chức đại diện sở hữu công nghiệp, tổ chức hành nghề luật sư hoặc chuyên gia độc lập để thực hiện các thủ tục liên quan."}</P>
      <H3>{"Điều 23. Khai thác và thương mại hóa quyền sở hữu trí tuệ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty có quyền trực tiếp khai thác hoặc cho phép tổ chức, cá nhân khác khai thác quyền sở hữu trí tuệ của mình theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc khai thác quyền sở hữu trí tuệ có thể được thực hiện thông qua: a) Cấp phép sử dụng; b) Chuyển nhượng quyền; c) Góp vốn; d) Hợp tác kinh doanh; đ) Các hình thức hợp pháp khác."}</P>
      <P style={{marginLeft:14}}>{"3.  Việc khai thác quyền sở hữu trí tuệ phải bảo đảm không làm ảnh hưởng đến quyền và lợi ích hợp pháp của Công ty."}</P>
      <H3>{"Điều 24. Bảo vệ quyền sở hữu trí tuệ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty áp dụng các biện pháp phù hợp nhằm bảo vệ quyền sở hữu trí tuệ của mình."}</P>
      <P style={{marginLeft:14}}>{"2.  Khi phát hiện hành vi xâm phạm quyền sở hữu trí tuệ, Công ty có quyền thực hiện các biện pháp theo quy định của pháp luật để bảo vệ quyền và lợi ích hợp pháp của mình."}</P>
      <P style={{marginLeft:14}}>{"3.  Người lao động, người quản lý và các cá nhân có liên quan có trách nhiệm thông báo kịp thời cho Công ty khi phát hiện hành vi có dấu hiệu xâm phạm quyền sở hữu trí tuệ của Công ty."}</P>
      <H3>{"Điều 25. Tôn trọng quyền sở hữu trí tuệ của bên thứ ba"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty cam kết tôn trọng quyền sở hữu trí tuệ của tổ chức, cá nhân khác."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty không sử dụng, sao chép, phân phối, sửa đổi hoặc khai thác trái phép các đối tượng sở hữu trí tuệ của bên thứ ba."}</P>
      <P style={{marginLeft:14}}>{"3.  Khi sử dụng tài sản trí tuệ của bên thứ ba, Công ty thực hiện đầy đủ các nghĩa vụ theo quy định của pháp luật và theo các thỏa thuận đã giao kết."}</P>
      <H3>{"Điều 26. Bảo mật và bí mật kinh doanh"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty áp dụng các biện pháp cần thiết để bảo vệ bí mật kinh doanh, bí quyết kỹ thuật, quy trình công nghệ và các thông tin có giá trị thương mại."}</P>
      <P style={{marginLeft:14}}>{"2.  Người lao động, người quản lý, cộng tác viên và các tổ chức, cá nhân có liên quan có trách nhiệm giữ bí mật các thông tin thuộc phạm vi bảo mật theo quy định của pháp luật, hợp đồng và quy chế nội bộ."}</P>
      <P style={{marginLeft:14}}>{"3.  Nghĩa vụ bảo mật vẫn có hiệu lực sau khi chấm dứt quan hệ lao động, hợp đồng hoặc quan hệ hợp tác trong phạm vi và thời hạn theo quy định của pháp luật hoặc theo thỏa thuận hợp pháp giữa các bên."}</P>
      <H3>{"Điều 27. Quản trị tài sản trí tuệ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty xây dựng hệ thống quản trị tài sản trí tuệ nhằm bảo đảm việc ghi nhận, theo dõi, đánh giá, khai thác và bảo vệ các quyền sở hữu trí tuệ."}</P>
      <P style={{marginLeft:14}}>{"2.  Chủ sở hữu có quyền ban hành các quy chế nội bộ về quản lý, khai thác, bảo hộ, chuyển giao và thương mại hóa tài sản trí tuệ."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty định kỳ rà soát danh mục tài sản trí tuệ nhằm phục vụ chiến lược phát triển, hoạt động kinh doanh và bảo vệ quyền, lợi ích hợp pháp của Công ty."}</P>
      <H2 id="quy-che-chuong-5">{"Phần IV. TRÍ TUỆ NHÂN TẠO (AI) VÀ PHẦN MỀM"}</H2>
      <H3>{"Điều 28. Nguyên tắc phát triển trí tuệ nhân tạo và phần mềm"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty nghiên cứu, phát triển, triển khai và khai thác trí tuệ nhân tạo (Artificial Intelligence - AI), phần mềm và các công nghệ số theo quy định của pháp luật, Quy chế này, Điều lệ Công ty và các văn bản triển khai của Công ty."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc phát triển AI và phần mềm phải hướng tới: a) Phục vụ lợi ích hợp pháp của khách hàng, đối tác, người lao động và Công ty; b) Đổi mới sáng tạo, nâng cao chất lượng sản phẩm và dịch vụ; c) Bảo đảm an toàn, bảo mật, minh bạch và trách nhiệm; d) Phát triển bền vững và có trách nhiệm đối với xã hội."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty không phát triển hoặc sử dụng AI và phần mềm nhằm thực hiện các hành vi bị pháp luật cấm."}</P>
      <H3>{"Điều 29. Nghiên cứu và phát triển"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty khuyến khích hoạt động nghiên cứu, phát triển và đổi mới sáng tạo trong lĩnh vực AI, phần mềm, khoa học dữ liệu, an toàn thông tin và các công nghệ liên quan."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty có quyền đầu tư nguồn lực cho hoạt động nghiên cứu và phát triển (Research and Development - R&D) phù hợp với chiến lược kinh doanh."}</P>
      <P style={{marginLeft:14}}>{"3.  Kết quả nghiên cứu và phát triển được quản lý theo quy định của pháp luật, Quy chế này, Điều lệ Công ty và các văn bản triển khai của Công ty."}</P>
      <H3>{"Điều 30. Phát triển và quản lý phần mềm"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty xây dựng, phát triển, vận hành, bảo trì và nâng cấp phần mềm theo quy trình quản lý phù hợp với quy mô và đặc điểm hoạt động."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty có thể phát triển phần mềm phục vụ nội bộ hoặc cung cấp cho khách hàng, đối tác và thị trường theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Việc quản lý mã nguồn, tài liệu kỹ thuật, phiên bản phần mềm, cấu hình hệ thống và quy trình triển khai được thực hiện theo quy chế nội bộ của Công ty."}</P>
      <H3>{"Điều 31. Phát triển và ứng dụng trí tuệ nhân tạo"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty có quyền nghiên cứu, phát triển, huấn luyện, triển khai và vận hành các hệ thống AI phục vụ hoạt động của Công ty hoặc cung cấp cho khách hàng, đối tác."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc phát triển và ứng dụng AI phải bảo đảm: a) Tuân thủ pháp luật; b) Tôn trọng quyền và lợi ích hợp pháp của tổ chức, cá nhân; c) Bảo đảm an toàn, bảo mật và quản trị rủi ro; d) Có cơ chế giám sát và đánh giá phù hợp với mức độ ảnh hưởng của hệ thống AI."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty khuyến khích việc đánh giá định kỳ hiệu quả, độ tin cậy và các rủi ro của hệ thống AI trong quá trình vận hành."}</P>
      <H3>{"Điều 32. Dữ liệu phục vụ AI và phần mềm"}</H3>
      <P style={{marginLeft:14}}>{"1.  Việc thu thập, sử dụng, lưu trữ và xử lý dữ liệu phục vụ phát triển AI và phần mềm phải tuân thủ quy định của pháp luật và Phần I (Quản trị dữ liệu) của Quy chế này."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty áp dụng các biện pháp phù hợp nhằm bảo đảm chất lượng, tính toàn vẹn, tính bảo mật và khả năng truy xuất của dữ liệu."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty không sử dụng dữ liệu trái pháp luật hoặc vi phạm quyền và lợi ích hợp pháp của tổ chức, cá nhân."}</P>
      <H3>{"Điều 33. Quản trị rủi ro đối với AI và phần mềm"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty xây dựng cơ chế nhận diện, đánh giá, kiểm soát và giảm thiểu rủi ro phát sinh trong quá trình phát triển và vận hành AI, phần mềm và các hệ thống công nghệ."}</P>
      <P style={{marginLeft:14}}>{"2.  Các rủi ro được quản lý bao gồm nhưng không giới hạn ở: a) Rủi ro an ninh mạng; b) Rủi ro bảo mật thông tin; c) Rủi ro kỹ thuật và vận hành; d) Rủi ro pháp lý; đ) Rủi ro liên quan đến quyền sở hữu trí tuệ; e) Các rủi ro khác theo đặc điểm hoạt động của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Khi phát hiện sự cố hoặc rủi ro nghiêm trọng, Công ty thực hiện các biện pháp cần thiết nhằm hạn chế thiệt hại, khôi phục hoạt động và thực hiện các nghĩa vụ theo quy định của pháp luật."}</P>
      <H3>{"Điều 34. Đạo đức trong phát triển và sử dụng AI"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty khuyến khích việc nghiên cứu, phát triển và sử dụng AI theo các nguyên tắc: a) Tôn trọng con người và quyền con người; b) Minh bạch trong phạm vi phù hợp với pháp luật và bí mật kinh doanh; c) Trách nhiệm giải trình; d) Công bằng và hạn chế các rủi ro do thiên lệch dữ liệu hoặc thuật toán gây ra; đ) Bảo đảm an toàn và an ninh trong quá trình vận hành."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty định kỳ rà soát các chính sách nội bộ về AI để phù hợp với sự phát triển của công nghệ và pháp luật."}</P>
      <H3>{"Điều 35. Hợp tác và tiêu chuẩn công nghệ"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty có quyền hợp tác với tổ chức, doanh nghiệp, cơ sở nghiên cứu, trường đại học và các đối tác khác trong hoạt động nghiên cứu, phát triển và ứng dụng AI, phần mềm."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty khuyến khích áp dụng các tiêu chuẩn, thông lệ và phương pháp quản trị phù hợp nhằm nâng cao chất lượng, tính tương thích và khả năng mở rộng của sản phẩm, dịch vụ."}</P>
      <P style={{marginLeft:14}}>{"3.  Việc lựa chọn công nghệ, nền tảng, tiêu chuẩn kỹ thuật và phương pháp phát triển thuộc thẩm quyền của Công ty theo từng thời kỳ và không bị giới hạn bởi Quy chế này."}</P>
      <H3>{"Điều 36. Phát triển bền vững trong lĩnh vực AI và phần mềm"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty định hướng phát triển AI và phần mềm theo hướng an toàn, hiệu quả, bền vững và có khả năng thích ứng với sự thay đổi của công nghệ."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty khuyến khích đầu tư vào nghiên cứu, đào tạo, phát triển nguồn nhân lực và đổi mới sáng tạo nhằm nâng cao năng lực cạnh tranh trong lĩnh vực AI và phần mềm."}</P>
      <P style={{marginLeft:14}}>{"3.  Chủ sở hữu có quyền ban hành hoặc sửa đổi các quy chế nội bộ về phát triển, quản trị và sử dụng AI, phần mềm để phù hợp với pháp luật và chiến lược phát triển của Công ty."}</P>
      <H2 id="quy-che-chuong-6">{"Phần V. AN TOÀN THÔNG TIN"}</H2>
      <H3>{"Điều 37. Nguyên tắc bảo đảm an toàn thông tin"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty xác định an toàn thông tin là một yếu tố cốt lõi trong hoạt động quản trị, kinh doanh, nghiên cứu, phát triển và cung cấp sản phẩm, dịch vụ."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty thực hiện các biện pháp quản lý, tổ chức và kỹ thuật phù hợp nhằm bảo đảm tính: a) Bảo mật của thông tin; b) Toàn vẹn của thông tin; c) Sẵn sàng của hệ thống thông tin; d) Khả năng xác thực; đ) Khả năng truy vết khi cần thiết."}</P>
      <P style={{marginLeft:14}}>{"3.  Việc bảo đảm an toàn thông tin được thực hiện theo quy định của pháp luật, Quy chế này, Điều lệ Công ty và các văn bản triển khai của Công ty."}</P>
      <H3>{"Điều 38. Phạm vi bảo vệ thông tin"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty thực hiện bảo vệ các loại thông tin thuộc phạm vi quản lý của mình, bao gồm nhưng không giới hạn:"}</P>
      <P style={{marginLeft:28}}>{"a) Thông tin quản trị doanh nghiệp;"}</P>
      <P style={{marginLeft:28}}>{"b) Thông tin tài chính, kế toán và thuế;"}</P>
      <P style={{marginLeft:28}}>{"c) Thông tin khách hàng;"}</P>
      <P style={{marginLeft:28}}>{"d) Thông tin người lao động;"}</P>
      <P style={{marginLeft:28}}>{"đ) Thông tin đối tác;"}</P>
      <P style={{marginLeft:28}}>{"e) Bí mật kinh doanh;"}</P>
      <P style={{marginLeft:28}}>{"g) Bí mật công nghệ;"}</P>
      <P style={{marginLeft:28}}>{"h) Dữ liệu và tài sản số;"}</P>
      <P style={{marginLeft:28}}>{"i) Các thông tin khác theo quy định của pháp luật hoặc theo quyết định của Chủ sở hữu."}</P>
      <P style={{marginLeft:14}}>{"2.  Mức độ bảo vệ đối với từng loại thông tin được xác định theo quy chế nội bộ của Công ty."}</P>
      <H3>{"Điều 39. Trách nhiệm bảo đảm an toàn thông tin"}</H3>
      <P style={{marginLeft:14}}>{"1.  Chủ sở hữu, người quản lý, người lao động, cộng tác viên và các cá nhân được phép truy cập hệ thống thông tin của Công ty có trách nhiệm bảo đảm an toàn thông tin trong phạm vi nhiệm vụ được giao."}</P>
      <P style={{marginLeft:14}}>{"2.  Mọi cá nhân có trách nhiệm:"}</P>
      <P style={{marginLeft:28}}>{"a) Tuân thủ các quy định về bảo mật thông tin;"}</P>
      <P style={{marginLeft:28}}>{"b) Bảo vệ tài khoản, thiết bị và phương tiện được giao;"}</P>
      <P style={{marginLeft:28}}>{"c) Không truy cập, sử dụng, sao chép, sửa đổi hoặc tiết lộ thông tin trái phép;"}</P>
      <P style={{marginLeft:28}}>{"d) Kịp thời báo cáo các sự cố hoặc nguy cơ mất an toàn thông tin."}</P>
      <H3>{"Điều 40. Quản lý hệ thống thông tin"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty xây dựng, vận hành và duy trì hệ thống thông tin theo nguyên tắc an toàn, ổn định và liên tục."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty có thể áp dụng các biện pháp phù hợp nhằm:"}</P>
      <P style={{marginLeft:28}}>{"a) Kiểm soát quyền truy cập;"}</P>
      <P style={{marginLeft:28}}>{"b) Quản lý tài khoản và định danh;"}</P>
      <P style={{marginLeft:28}}>{"c) Sao lưu và phục hồi dữ liệu;"}</P>
      <P style={{marginLeft:28}}>{"d) Ghi nhận nhật ký hoạt động của hệ thống;"}</P>
      <P style={{marginLeft:28}}>{"đ) Giám sát hoạt động của hệ thống;"}</P>
      <P style={{marginLeft:28}}>{"e) Kiểm tra và đánh giá mức độ an toàn thông tin;"}</P>
      <P style={{marginLeft:28}}>{"g) Các biện pháp khác phù hợp với quy mô hoạt động."}</P>
      <P style={{marginLeft:14}}>{"3.  Việc lựa chọn giải pháp kỹ thuật thuộc quyền quyết định của Công ty theo từng thời kỳ."}</P>
      <H3>{"Điều 41. Ứng phó sự cố an toàn thông tin"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty xây dựng quy trình tiếp nhận, xử lý và khắc phục các sự cố an toàn thông tin."}</P>
      <P style={{marginLeft:14}}>{"2.  Khi xảy ra sự cố, Công ty có trách nhiệm:"}</P>
      <P style={{marginLeft:28}}>{"a) Hạn chế thiệt hại;"}</P>
      <P style={{marginLeft:28}}>{"b) Khôi phục hoạt động của hệ thống;"}</P>
      <P style={{marginLeft:28}}>{"c) Bảo vệ quyền và lợi ích hợp pháp của Công ty, khách hàng và các bên liên quan;"}</P>
      <P style={{marginLeft:28}}>{"d) Thực hiện các nghĩa vụ theo quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"3.  Công ty thực hiện việc ghi nhận, đánh giá nguyên nhân và áp dụng các biện pháp phòng ngừa nhằm hạn chế việc tái diễn sự cố."}</P>
      <H3>{"Điều 42. Kiểm tra và đánh giá an toàn thông tin"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty có quyền tổ chức hoặc thuê tổ chức, cá nhân độc lập thực hiện việc kiểm tra, đánh giá mức độ an toàn thông tin khi cần thiết."}</P>
      <P style={{marginLeft:14}}>{"2.  Công ty định kỳ rà soát các quy trình, hệ thống và biện pháp bảo đảm an toàn thông tin nhằm nâng cao hiệu quả quản trị và thích ứng với sự phát triển của công nghệ."}</P>
      <P style={{marginLeft:14}}>{"3.  Kết quả kiểm tra, đánh giá được sử dụng để cải tiến hệ thống quản lý an toàn thông tin của Công ty."}</P>
      <H3>{"Điều 43. Đào tạo và nâng cao nhận thức"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty khuyến khích việc đào tạo, phổ biến kiến thức và nâng cao nhận thức về an toàn thông tin cho người quản lý, người lao động và các cá nhân có liên quan."}</P>
      <P style={{marginLeft:14}}>{"2.  Nội dung đào tạo có thể bao gồm:"}</P>
      <P style={{marginLeft:28}}>{"a) Bảo mật thông tin;"}</P>
      <P style={{marginLeft:28}}>{"b) An toàn dữ liệu;"}</P>
      <P style={{marginLeft:28}}>{"c) An ninh mạng;"}</P>
      <P style={{marginLeft:28}}>{"d) Quản lý rủi ro;"}</P>
      <P style={{marginLeft:28}}>{"đ) Ứng phó sự cố;"}</P>
      <P style={{marginLeft:28}}>{"e) Các nội dung khác phù hợp với hoạt động của Công ty."}</P>
      <H3>{"Điều 44. Hợp tác về an toàn thông tin"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty có quyền hợp tác với các tổ chức, doanh nghiệp, cơ quan nhà nước, cơ sở nghiên cứu, chuyên gia và các đối tác khác nhằm nâng cao năng lực bảo đảm an toàn thông tin."}</P>
      <P style={{marginLeft:14}}>{"2.  Việc hợp tác phải bảo đảm tuân thủ quy định của pháp luật, bảo vệ bí mật kinh doanh, quyền sở hữu trí tuệ và quyền, lợi ích hợp pháp của Công ty."}</P>
      <H3>{"Điều 45. Cập nhật và hoàn thiện hệ thống an toàn thông tin"}</H3>
      <P style={{marginLeft:14}}>{"1.  Công ty thường xuyên rà soát, cập nhật và hoàn thiện hệ thống quản lý an toàn thông tin phù hợp với sự phát triển của công nghệ, yêu cầu hoạt động và quy định của pháp luật."}</P>
      <P style={{marginLeft:14}}>{"2.  Chủ sở hữu có quyền ban hành, sửa đổi hoặc thay thế các quy chế nội bộ về an toàn thông tin nhằm nâng cao hiệu quả quản trị và bảo vệ tài sản của Công ty."}</P>
      <P style={{marginLeft:14}}>{"3.  Các biện pháp bảo đảm an toàn thông tin của Công ty được thực hiện trên cơ sở cân bằng giữa yêu cầu bảo mật, hiệu quả hoạt động, chi phí và khả năng phát triển lâu dài."}</P>
      <P>{"Cần Thơ, ngày ........ tháng ........ năm 2026"}</P>
      <P><Strong>{"CHỦ SỞ HỮU CÔNG TY"}</Strong></P>
      <P>{"*(Ký, ghi rõ họ tên)*"}</P>
      <P><Strong>{"LÊ BÍCH NGƯNG"}</Strong></P>
      <HR/>
      <Disclaimer>
        This page is currently unlinked from the main site and not indexed by search engines,
        pending finalization of company registration. Once registration is complete, remaining
        placeholders (business registration number, filing date) will be filled in and this page
        will be linked from the site footer.
      </Disclaimer>
    </LegalPage>
  );
}
