import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export const Setting = (props) => {
  return (
    <SvgIcon
      {...props}
      style={{ fill: props.fill || "transparent" }}
      viewBox={props.viewBox || "0 0 40 40"}
      width="40"
      height="40"
    >
      <rect width="40" height="40" rx="10" fill="#232323" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20 13.9602C19.8129 13.9602 19.6335 14.0345 19.5013 14.1668C19.369 14.2991 19.2947 14.4785 19.2947 14.6655V14.7663L19.2947 14.7682C19.2935 15.0526 19.2093 15.3304 19.0523 15.5675C18.8953 15.8046 18.6723 15.9906 18.411 16.1026C18.3669 16.1215 18.3203 16.1336 18.2729 16.1387C18.0321 16.2252 17.7723 16.2471 17.5194 16.2013C17.2328 16.1493 16.9682 16.0126 16.76 15.8089L16.7562 15.8052L16.7206 15.7696C16.6551 15.704 16.5772 15.6518 16.4915 15.6163C16.4059 15.5808 16.3141 15.5626 16.2214 15.5626C16.1287 15.5626 16.0369 15.5808 15.9513 15.6163C15.8657 15.6518 15.7879 15.7039 15.7224 15.7694C15.6568 15.8349 15.6044 15.9131 15.5689 15.9987C15.5334 16.0844 15.5152 16.1761 15.5152 16.2688C15.5152 16.3615 15.5334 16.4533 15.5689 16.5389C15.6044 16.6246 15.6564 16.7024 15.722 16.7679L15.7615 16.8074C15.9652 17.0156 16.1019 17.2802 16.1539 17.5668C16.2049 17.8485 16.1719 18.1389 16.0592 18.4018C15.9572 18.6704 15.7781 18.903 15.5443 19.0702C15.3063 19.2404 15.0226 19.3351 14.7301 19.342L14.7189 19.3421H14.6655C14.4785 19.3421 14.2991 19.4164 14.1668 19.5487C14.0345 19.6809 13.9602 19.8604 13.9602 20.0474C13.9602 20.2345 14.0345 20.4139 14.1668 20.5462C14.2991 20.6784 14.4785 20.7528 14.6655 20.7528H14.7682C15.0526 20.7539 15.3304 20.8381 15.5675 20.9952C15.8038 21.1517 15.9894 21.3737 16.1016 21.6341C16.2184 21.9 16.2531 22.1948 16.2013 22.4806C16.1493 22.7672 16.0126 23.0318 15.8089 23.24L15.8052 23.2438L15.7696 23.2794C15.704 23.3449 15.6518 23.4229 15.6163 23.5085C15.5808 23.5941 15.5626 23.6859 15.5626 23.7786C15.5626 23.8713 15.5808 23.9631 15.6163 24.0487C15.6518 24.1343 15.7039 24.2121 15.7694 24.2776C15.8349 24.3432 15.9131 24.3956 15.9987 24.4311C16.0844 24.4666 16.1761 24.4848 16.2688 24.4848C16.3615 24.4848 16.4533 24.4666 16.5389 24.4311C16.6246 24.3956 16.7024 24.3436 16.7679 24.278L16.8074 24.2385C17.0156 24.0348 17.2802 23.8981 17.5668 23.8461C17.8485 23.7951 18.1389 23.8281 18.4018 23.9408C18.6704 24.0428 18.903 24.2219 19.0702 24.4557C19.2404 24.6937 19.3351 24.9774 19.342 25.2699L19.3421 25.2811V25.3345C19.3421 25.5215 19.4164 25.7009 19.5487 25.8332C19.6809 25.9655 19.8604 26.0398 20.0474 26.0398C20.2345 26.0398 20.4139 25.9655 20.5462 25.8332C20.6784 25.7009 20.7528 25.5215 20.7528 25.3345V25.2337L20.7528 25.2318C20.7539 24.9474 20.8381 24.6696 20.9952 24.4325C21.1517 24.1961 21.3737 24.0105 21.6341 23.8984C21.9 23.7816 22.1948 23.7469 22.4806 23.7987C22.7672 23.8507 23.0318 23.9874 23.24 24.1911L23.2438 24.1948L23.2794 24.2304C23.3449 24.2959 23.4229 24.3482 23.5085 24.3837C23.5941 24.4192 23.6859 24.4374 23.7786 24.4374C23.8713 24.4374 23.9631 24.4192 24.0487 24.3837C24.1343 24.3482 24.2121 24.2961 24.2776 24.2306C24.3432 24.1651 24.3956 24.0869 24.4311 24.0013C24.4666 23.9156 24.4848 23.8238 24.4848 23.7312C24.4848 23.6385 24.4666 23.5467 24.4311 23.4611C24.3956 23.3754 24.3436 23.2976 24.278 23.2321L24.2385 23.1926C24.0348 22.9844 23.8981 22.7198 23.8461 22.4332C23.7943 22.1473 23.8291 21.8525 23.9459 21.5866C24.058 21.3263 24.2436 21.1043 24.4799 20.9477C24.717 20.7907 24.9948 20.7065 25.2792 20.7053L25.2811 20.7053L25.3345 20.7053C25.5215 20.7053 25.7009 20.631 25.8332 20.4987C25.9655 20.3665 26.0398 20.1871 26.0398 20C26.0398 19.8129 25.9655 19.6335 25.8332 19.5013C25.7009 19.369 25.5215 19.2947 25.3345 19.2947H25.2337L25.2318 19.2947C24.9474 19.2935 24.6696 19.2093 24.4325 19.0523C24.1954 18.8953 24.0094 18.6723 23.8974 18.411C23.8785 18.3669 23.8664 18.3203 23.8613 18.2728C23.7748 18.0321 23.7529 17.7723 23.7987 17.5194C23.8507 17.2328 23.9874 16.9682 24.1911 16.76L24.1948 16.7562L24.2304 16.7206C24.296 16.6551 24.3482 16.5771 24.3837 16.4915C24.4192 16.4059 24.4374 16.3141 24.4374 16.2214C24.4374 16.1287 24.4192 16.0369 24.3837 15.9513C24.3482 15.8657 24.2961 15.7879 24.2306 15.7224C24.1651 15.6568 24.0869 15.6044 24.0013 15.5689C23.9156 15.5334 23.8239 15.5152 23.7312 15.5152C23.6385 15.5152 23.5467 15.5334 23.4611 15.5689C23.3754 15.6044 23.2976 15.6564 23.2321 15.722L23.1926 15.7615C22.9844 15.9652 22.7198 16.1019 22.4332 16.1539C22.1473 16.2057 21.8526 16.171 21.5866 16.0541C21.3263 15.942 21.1043 15.7564 20.9477 15.5201C20.7907 15.283 20.7065 15.0052 20.7053 14.7208L20.7053 14.7189V14.6655C20.7053 14.4785 20.631 14.2991 20.4987 14.1668C20.3665 14.0345 20.1871 13.9602 20 13.9602ZM18.8223 13.4878C19.1346 13.1755 19.5583 13 20 13C20.4417 13 20.8654 13.1755 21.1777 13.4878C21.4901 13.8002 21.6655 14.2238 21.6655 14.6655V14.7178C21.6661 14.8146 21.6948 14.9092 21.7483 14.9899C21.8019 15.0708 21.878 15.1344 21.9673 15.1726L21.972 15.1746C22.063 15.2148 22.164 15.2268 22.2619 15.2091C22.359 15.1914 22.4487 15.1453 22.5196 15.0766L22.5528 15.0434C22.7075 14.8886 22.8912 14.7657 23.0934 14.6819C23.2956 14.5981 23.5123 14.555 23.7312 14.555C23.95 14.555 24.1668 14.5981 24.369 14.6819C24.571 14.7657 24.7545 14.8884 24.9092 15.0431C25.064 15.1977 25.1869 15.3814 25.2707 15.5836C25.3545 15.7858 25.3976 16.0025 25.3976 16.2214C25.3976 16.4403 25.3545 16.657 25.2707 16.8592C25.1869 17.0614 25.064 17.2451 24.9092 17.3998L24.876 17.433C24.8073 17.5038 24.7611 17.5936 24.7435 17.6907C24.7258 17.7886 24.7378 17.8896 24.7779 17.9806C24.7942 18.0173 24.8057 18.0559 24.8122 18.0953C24.8501 18.1576 24.9014 18.2111 24.9627 18.2517C25.0434 18.3052 25.138 18.3339 25.2348 18.3345H25.3345C25.7762 18.3345 26.1998 18.5099 26.5122 18.8223C26.8245 19.1346 27 19.5583 27 20C27 20.4417 26.8245 20.8654 26.5122 21.1777C26.1998 21.4901 25.7762 21.6655 25.3345 21.6655H25.2822C25.1854 21.6661 25.0908 21.6948 25.0101 21.7483C24.9292 21.8019 24.8656 21.878 24.8274 21.9673L24.8254 21.972C24.7852 22.063 24.7732 22.164 24.7909 22.2619C24.8086 22.359 24.8547 22.4487 24.9234 22.5196L24.9566 22.5528C25.1114 22.7075 25.2343 22.8912 25.3181 23.0934C25.4019 23.2956 25.445 23.5123 25.445 23.7312C25.445 23.95 25.4019 24.1668 25.3181 24.369C25.2343 24.5711 25.1115 24.7547 24.9568 24.9093C24.8021 25.0641 24.6185 25.1869 24.4164 25.2707C24.2142 25.3545 23.9975 25.3976 23.7786 25.3976C23.5597 25.3976 23.343 25.3545 23.1408 25.2707C22.9386 25.1869 22.7549 25.064 22.6002 24.9091L22.567 24.876C22.4961 24.8072 22.4064 24.7611 22.3093 24.7435C22.2114 24.7258 22.1104 24.7378 22.0194 24.7779L22.0147 24.78C21.9255 24.8183 21.8493 24.8817 21.7957 24.9627C21.7423 25.0434 21.7135 25.138 21.713 25.2348V25.3345C21.713 25.7762 21.5375 26.1998 21.2251 26.5122C20.9128 26.8245 20.4891 27 20.0474 27C19.6057 27 19.1821 26.8245 18.8697 26.5122C18.5574 26.1998 18.3819 25.7762 18.3819 25.3345V25.2877C18.3787 25.1894 18.3464 25.0943 18.2892 25.0143C18.2311 24.9331 18.1499 24.8712 18.0561 24.8367C18.0466 24.8332 18.0373 24.8294 18.028 24.8253C17.937 24.7852 17.836 24.7732 17.7381 24.7909C17.641 24.8086 17.5513 24.8547 17.4804 24.9234L17.4472 24.9566C17.2926 25.1113 17.1088 25.2343 16.9066 25.3181C16.7044 25.4019 16.4877 25.445 16.2688 25.445C16.05 25.445 15.8332 25.4019 15.631 25.3181C15.4288 25.2343 15.2452 25.1114 15.0905 24.9566C14.9358 24.802 14.8131 24.6184 14.7293 24.4164C14.6455 24.2142 14.6024 23.9975 14.6024 23.7786C14.6024 23.5597 14.6455 23.343 14.7293 23.1408C14.8131 22.9386 14.936 22.7549 15.0908 22.6002L15.124 22.567C15.1928 22.4962 15.2389 22.4064 15.2565 22.3093C15.2742 22.2114 15.2622 22.1104 15.2221 22.0194L15.22 22.0147C15.1817 21.9255 15.1183 21.8493 15.0373 21.7957C14.9566 21.7423 14.862 21.7135 14.7652 21.713H14.6655C14.2238 21.713 13.8002 21.5375 13.4878 21.2251C13.1755 20.9128 13 20.4891 13 20.0474C13 19.6057 13.1755 19.1821 13.4878 18.8697C13.8002 18.5574 14.2238 18.3819 14.6655 18.3819H14.7123C14.8106 18.3787 14.9057 18.3464 14.9857 18.2892C15.0669 18.2311 15.1288 18.1499 15.1633 18.0561C15.1668 18.0466 15.1706 18.0373 15.1747 18.028C15.2148 17.937 15.2268 17.836 15.2091 17.7381C15.1914 17.641 15.1453 17.5513 15.0766 17.4804L15.0434 17.4472C14.8887 17.2926 14.7657 17.1088 14.6819 16.9066C14.5981 16.7044 14.555 16.4877 14.555 16.2688C14.555 16.05 14.5981 15.8332 14.6819 15.631C14.7657 15.4289 14.8885 15.2453 15.0432 15.0907C15.1979 14.9359 15.3815 14.8131 15.5836 14.7293C15.7858 14.6455 16.0025 14.6024 16.2214 14.6024C16.4403 14.6024 16.657 14.6455 16.8592 14.7293C17.0613 14.8131 17.245 14.9359 17.3996 15.0907L17.433 15.124C17.5038 15.1928 17.5936 15.2389 17.6907 15.2565C17.7886 15.2742 17.8896 15.2622 17.9806 15.2221C18.0173 15.2058 18.0559 15.1943 18.0953 15.1878C18.1576 15.1499 18.2111 15.0986 18.2517 15.0373C18.3052 14.9566 18.3339 14.862 18.3345 14.7652V14.6655C18.3345 14.2238 18.5099 13.8002 18.8223 13.4878ZM20 18.7019C19.2831 18.7019 18.7019 19.2831 18.7019 20C18.7019 20.7169 19.2831 21.2981 20 21.2981C20.7169 21.2981 21.2981 20.7169 21.2981 20C21.2981 19.2831 20.7169 18.7019 20 18.7019ZM17.7417 20C17.7417 18.7528 18.7528 17.7417 20 17.7417C21.2472 17.7417 22.2583 18.7528 22.2583 20C22.2583 21.2472 21.2472 22.2583 20 22.2583C18.7528 22.2583 17.7417 21.2472 17.7417 20Z"
        fill="#FAFAFA"
      />
    </SvgIcon>
  );
};
