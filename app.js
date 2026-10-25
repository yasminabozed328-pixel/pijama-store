
/*
  Pijama Store
  الطلبات لن تُحفظ على الإنترنت إلا بعد إعداد Supabase
  ومراجعة سياسات الأمان RLS.
*/
const STORE = {
  name: "Pijama Store",
  supabaseUrl: "",
  supabaseAnonKey: ""
};

const products = [
  {
    id: "jumpsuit-1",
    name: "جامب سوت بكابيشو فرو",
    category: "winter",
    price: 550,
    description: "بيج سايز يناسب وزن من 80 إلى 110 كيلو",
    sizes: ["بيج سايز"],
    image: "images/products/jumpsuit1.png",
    label: "شتوي"
  },
  {
    id: "jumpsuit-2",
    name: "جامب سوت بكابيشو فرو",
    category: "winter",
    price: 500,
    description: "وان سايز يناسب وزن من 60 إلى 75 كيلو",
    sizes: ["وان سايز"],
    image: "images/products/jumpsuit2.png",
    label: "شتوي"
  },
  {
    id: "jumpsuit-3",
    name: "جامب سوت بكابيشو فرو",
    category: "winter",
    price: 500,
    description: "وان سايز يناسب وزن من 60 إلى 75 كيلو",
    sizes: ["وان سايز"],
    image: "images/products/jumpsuit3.jpeg",
    label: "شتوي"
  },
  {
    id: "jumpsuit-4",
    name: "جامب سوت بكابيشو فرو",
    category: "winter",
    price: 550,
    description: "بيج سايز يناسب وزن من 80 إلى 110 كيلو",
    sizes: ["بيج سايز"],
    colors: [],
    image: "images/products/jumpsuit4.jpeg",
    label: "شتوي"
  },

  ...Array.from({ length: 13 }, (_, i) => {
    const number = i + 1;
    const smallSize = number === 2 || number === 10;

    return {
      id: `pajama-${number}`,
      name: "بيجامة شتوي قطيفة هايدي مستورد",
      category: "winter",
      price: smallSize ? 620 : 650,
      description: smallSize
        ? "وان سايز يناسب وزن من 50 إلى 75 كيلو"
        : "بيج سايز يناسب وزن من 75 إلى 105 كيلو",
      sizes: [smallSize ? "وان سايز" : "بيج سايز"],
      colors: [],
      image: `images/products/pajama${number}.${[12, 13].includes(number) ? "jpeg" : "png"}`,
      label: "شتوي"
    };
  }),

  ...Array.from({ length: 9 }, (_, i) => {
    const number = i + 1;
    const oneSize = number === 1;

    return {
      id: `summer-${number}`,
      name: "بيجامة صيفي",
      category: "summer",
      price: 400,
      description: oneSize
        ? "وان سايز يناسب وزن من 50 إلى 75 كيلو"
        : "بيج سايز يناسب وزن من 75 إلى 100 كيلو",
      sizes: [oneSize ? "وان سايز" : "بيج سايز"],
      colors: [],
      image: `images/products/summer${number}.jpeg`,
      label: "صيفي"
    };
  }),
  
  ...Array.from({ length: 8 }, (_, i) => {
    const number = i + 1;
    const expensive = number === 7 || number === 8;

    return {
      id: `lingerie-${number}`,
      name: `لانجري وقميص نوم موديل ${number}`,
      category: "lingerie",
      price: expensive ? 600 : 400,
      description: "اختاري المقاس المناسب قبل تأكيد الطلب",
      sizes: ["المقاس حسب المتاح"],
      colors: [],
      image: `images/products/lingerie${number}.jpeg`,
      label: "لانجري"
    };
  }),

];


const money = n => `${Number(n).toLocaleString("ar-EG")} ج.م`;
const cart = [];
let activeFilter = "all";
let supabaseClient = null;

document.getElementById("brand-name").textContent = STORE.name;
document.getElementById("footer-brand").textContent = STORE.name;
document.title = `${STORE.name} | بيجامات ولانجري`;
document.getElementById("year").textContent = new Date().getFullYear();

if (STORE.supabaseUrl && STORE.supabaseAnonKey && window.supabase) {
  supabaseClient = window.supabase.createClient(
    STORE.supabaseUrl,
    STORE.supabaseAnonKey
  );
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function categoryName(p) {
  if (p.id.startsWith("jumpsuit-")) {
    return "جامب سوت فرو شتوي";
  }

  return p.category === "winter" ? "بيجامات شتوي"
    : p.category === "summer" ? "بيجامات صيفي"
    : "لانجري وقمصان نوم";
}

function caption(p) {
  return p.category === "winter" ? "WINTER COMFORT"
    : p.category === "summer" ? "SUMMER DAYS"
    : "SOFT & ELEGANT";
}

function productCard(p, isBestSeller = false) {
  return `
    <article class="product-card">
      <div class="product-image">
        <span class="product-tag">${isBestSeller ? "الأكثر مبيعًا" : escapeHtml(p.label)}</span>
        ${
          p.image
            ? `<img class="real-product-image" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
               <span class="placeholder-art" aria-hidden="true" style="display:none;">${p.symbol || "✿"}</span>`
            : `<span class="placeholder-art" aria-hidden="true">${p.symbol || "✿"}</span>`
        }
        <span class="image-caption">${caption(p)}</span>
      </div>
      <div class="product-info">
        <h3>${escapeHtml(p.name)}</h3>
        <p>${categoryName(p)} · ${escapeHtml(p.description)}</p>
        <div class="product-bottom">
          <span class="product-price">${money(p.price)}</span>
          <button type="button" class="add-to-cart" data-add="${p.id}">
            + أضيفي للسلة
          </button>
        </div>
      </div>
    </article>
  `;
}

function connectAddButtons(grid) {
  grid.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.dataset.add));
  });
}

function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const visible = products.filter(
    p => activeFilter === "all" || p.category === activeFilter
  );

  grid.innerHTML = visible.map(productCard).join("");
  connectAddButtons(grid);
}


function renderBestSellers() {
  const grid = document.getElementById("best-sellers-grid");
  if (!grid) return;

  const bestSellerIds = [
    "jumpsuit-1",
    "pajama-3",
    "pajama-7",
    "pajama-10",
    "summer-9",
    "summer-3",
    "lingerie-7",
    "lingerie-5"
  ];

  const bestSellers = bestSellerIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  grid.innerHTML = bestSellers
    .map(p => productCard(p, true))
    .join("");

  connectAddButtons(grid);
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  const found = cart.find(x => x.id === id);
  if (found) found.quantity += 1;
  else cart.push({...p, quantity: 1});

  renderCart();
  document.getElementById("checkout")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function renderCart() {
  const count = document.getElementById("cart-count");
  const total = document.getElementById("cart-total");
  const lines = document.getElementById("cart-lines");

  if (!count || !total || !lines) return;

  count.textContent = cart.reduce((n, x) => n + x.quantity, 0)
    .toLocaleString("ar-EG");

  total.textContent = money(
    cart.reduce((n, x) => n + x.price * x.quantity, 0)
  );

  if (!cart.length) {
    lines.innerHTML = '<p class="empty-cart">لسه مفيش منتجات في السلة. اختاري قطعة من المجموعة فوق.</p>';
    return;
  }

  lines.innerHTML = cart.map(p => `
    <div class="cart-line">
      <div>
        <strong>${escapeHtml(p.name)}</strong>
        <small>${money(p.price)} · ${escapeHtml(p.description)}</small>
      </div>
      <div class="quantity-controls">
        <button type="button" data-minus="${p.id}" aria-label="تقليل الكمية">−</button>
        <span>${p.quantity.toLocaleString("ar-EG")}</span>
        <button type="button" data-plus="${p.id}" aria-label="زيادة الكمية">+</button>
      </div>
      <button type="button" class="remove-button" data-remove="${p.id}">حذف</button>
    </div>
  `).join("");

  lines.querySelectorAll("[data-plus]").forEach(b =>
    b.addEventListener("click", () => {
      const p = cart.find(x => x.id === b.dataset.plus);
      if (p) p.quantity++;
      renderCart();
    })
  );

  lines.querySelectorAll("[data-minus]").forEach(b =>
    b.addEventListener("click", () => {
      const p = cart.find(x => x.id === b.dataset.minus);
      if (!p) return;
      p.quantity--;
      if (p.quantity <= 0) cart.splice(cart.indexOf(p), 1);
      renderCart();
    })
  );

  lines.querySelectorAll("[data-remove]").forEach(b =>
    b.addEventListener("click", () => {
      const i = cart.findIndex(x => x.id === b.dataset.remove);
      if (i >= 0) cart.splice(i, 1);
      renderCart();
    })
  );
}

document.querySelectorAll("[data-filter]").forEach(btn => {
  btn.addEventListener("click", () => {
    activeFilter = btn.dataset.filter;

    document.querySelectorAll("[data-filter]").forEach(b => {
      b.classList.toggle("active", b === btn);
    });

    renderProducts();
  });
});

document.getElementById("cart-jump")?.addEventListener("click", () => {
  document.getElementById("checkout")?.scrollIntoView({
    behavior: "smooth"
  });
});
function getShippingPrice(area) {
  const shippingPrices = {
    "فيصل": 70,
    "الهرم": 70,
    "بولاق الدكرور": 70,
    "المهندسين": 70,
    "وسط البلد": 70,
    "الزمالك": 70,
    "أكتوبر": 70,
    "الشيخ زايد": 70,
    "حدائق الأهرام": 70,
    "التجمع الخامس": 70,
    "مدينة نصر": 70,
    "مصر الجديدة": 70,
    "حلوان": 70,
    "شبرا الخيمة": 70,

    "مدينة المستقبل": 75,
    "مدينتي": 75,
    "الشروق": 75,
    "العبور": 75,
    "القلج": 75,
    "الرحاب": 75,
    "الصف": 75,
    "أطفيح": 75,
    "العياط": 75,
    "مدينة بدر": 75,
    "المنصورية": 75,

    "الإسكندرية": 80,

    "كفر الشيخ": 85,
    "البحيرة": 85,
    "بورسعيد": 85,
    "الدقهلية": 85,
    "المنوفية": 85,
    "دمياط": 85,
    "القليوبية": 85,
    "الغربية": 85,
    "الشرقية": 85,
    "السويس": 85,
    "الإسماعيلية": 85,

    "الفيوم": 100,
    "المنيا": 100,
    "بني سويف": 100,

    "أسيوط": 105,
    "سوهاج": 105,
    "قنا": 105,
    "الأقصر": 105,
    "أسوان": 105,

    "الساحل الشمالي": 110,
    "مرسى مطروح": 110,

    "البحر الأحمر": 120,
    "الغردقة": 120,
    "الوادي الجديد": 120
  };

  return shippingPrices[area] ?? null;
}


const orderForm = document.getElementById("order-form");

if (orderForm) {
  orderForm.addEventListener("submit", async event => {
    event.preventDefault();

    const message = document.getElementById("form-message");
    const submit = document.getElementById("submit-order");
    const confirmation = document.getElementById("order-confirmation");

    if (message) {
      message.className = "form-message";
      message.textContent = "";
    }

    if (!cart.length) {
      if (message) {
        message.textContent =
          "ضيفي منتج واحد على الأقل للسلة قبل تأكيد الطلب.";
        message.classList.add("error");
      }
      return;
    }

    const form = new FormData(event.currentTarget);
    const area = String(form.get("area") || "").trim();
    const shipping = getShippingPrice(area);

    if (shipping === null) {
      if (message) {
        message.textContent =
          "اختاري منطقة شحن صحيحة من القائمة قبل تأكيد الطلب.";
        message.classList.add("error");
      }
      return;
    }

    const subtotal = cart.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );

    const order = {
      name: String(form.get("customer_name") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      area,
      address: String(form.get("address") || "").trim(),
      notes: String(form.get("notes") || "").trim(),
      payment_method: "cash_on_delivery",
      items: cart.map(product => ({
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity
      })),
      subtotal,
      shipping,
      total: subtotal + shipping
    };

    if (submit) {
      submit.disabled = true;
      submit.textContent = "جارٍ إرسال الطلب...";
    }

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbyVKXfNqbue-BAwmtmFBnrFMavlzcl6fdevwhHrAQOHaUEkik5bs8ELZkVtpJn27bjCig/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(order)
        }
      );

      // تجهيز شاشة تأكيد الطلب
      const itemsBox =
        document.getElementById("confirmation-items");
      const subtotalBox =
        document.getElementById("confirmation-subtotal");
      const shippingBox =
        document.getElementById("confirmation-shipping");
      const totalBox =
        document.getElementById("confirmation-total");

      if (
        !confirmation ||
        !itemsBox ||
        !subtotalBox ||
        !shippingBox ||
        !totalBox
      ) {
        throw new Error(
          "تأكدي من وجود جميع عناصر شاشة التأكيد في index.html"
        );
      }

      // عرض المنتجات بطريقة آمنة
      itemsBox.replaceChildren();

     
order.items.forEach(item => {
  const product = products.find(p => p.id === item.product_id);

  const row = document.createElement("div");
  row.className = "confirmation-product";

  if (product && product.image) {
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.className = "confirmation-product-image";
    image.loading = "lazy";
    row.appendChild(image);
  }

  const details = document.createElement("div");
  details.className = "confirmation-product-details";

  const name = document.createElement("strong");
  name.textContent = item.name
    .replace(/موديل\s*\d+/gi, "")
    .trim();

  const quantity = document.createElement("p");
  quantity.textContent = `الكمية: ${item.quantity}`;

  const price = document.createElement("p");
  price.textContent = `${item.price * item.quantity} جنيه`;

  details.append(name, quantity, price);
  row.appendChild(details);
  itemsBox.appendChild(row);
});
 

      subtotalBox.textContent = `${order.subtotal} جنيه`;
      shippingBox.textContent = `${order.shipping} جنيه`;
      totalBox.textContent = `${order.total} جنيه`;

      confirmation.hidden = false;

      if (message) {
        message.textContent =
          "تم إرسال الطلب. راجعي تسجيله في المتجر 💗";
        message.classList.add("success");
      }

      confirmation.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      renderCart();
      event.currentTarget.reset();

    } catch (error) {
      console.error("Order confirmation error:", error);

      if (message) {
        message.textContent =
          "تعذر عرض تأكيد الطلب. افتحي Console لمعرفة السبب.";
        message.classList.add("error");
      }

    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent =
          "تأكيد الطلب — الدفع عند الاستلام";
      }
    }
  });
}


renderProducts();
renderBestSellers();
renderCart();

const reviewImages = [
  "images/review1.jpeg",
  "images/review2.jpeg",
  "images/review3.jpeg",
  "images/review4.jpeg",
  "images/review5.jpeg",
  "images/review6.jpeg",
  "images/review7.jpeg"
];

let currentReview = 0;

const reviewImage = document.getElementById("reviewImage");
const reviewCounter = document.getElementById("reviewCounter");
const nextReview = document.getElementById("nextReview");
const prevReview = document.getElementById("prevReview");

function showReview(index) {
  currentReview = (index + reviewImages.length) % reviewImages.length;

  reviewImage.classList.add("review-fade");

  setTimeout(() => {
    reviewImage.src = reviewImages[currentReview];

    reviewCounter.textContent =
      `${currentReview + 1} / ${reviewImages.length}`;

    reviewImage.onload = () => {
      reviewImage.classList.remove("review-fade");
    };

    if (reviewImage.complete) {
      reviewImage.classList.remove("review-fade");
    }
  }, 250);
}

if (reviewImage && reviewCounter && nextReview && prevReview) {
  nextReview.addEventListener("click", () => {
    showReview(currentReview + 1);
  });

  prevReview.addEventListener("click", () => {
    showReview(currentReview - 1);
  });

  showReview(0);
}
// Save order confirmation as an image
document.getElementById("save-confirmation")?.addEventListener("click", async () => {
  const confirmation = document.getElementById("order-confirmation");

  if (!confirmation) return;

  if (typeof html2canvas === "undefined") {
    alert("هنحتاج نضيف مكتبة حفظ الصور الأول.");
    return;
  }

  try {
    const canvas = await html2canvas(confirmation, {
      backgroundColor: "#fff5fa",
      scale: 2
    });

    const link = document.createElement("a");
    link.download = "Pijama-Store-Order.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (error) {
    console.error(error);
    alert("حصلت مشكلة أثناء حفظ الصورة. حاولي مرة تانية.");
  }
});