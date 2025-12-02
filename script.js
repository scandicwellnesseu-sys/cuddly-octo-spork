const tocContainer = document.getElementById("toc");
const sections = document.querySelectorAll(".content section[id]");

function buildToc() {
    if (!tocContainer) return;
    const list = document.createElement("ul");
    list.className = "toc__list";

    sections.forEach(section => {
        const heading = section.querySelector("h2");
        if (!heading) return;

        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = `#${section.id}`;
        link.textContent = heading.textContent;
        link.addEventListener("click", event => {
            event.preventDefault();
            document.querySelector(link.getAttribute("href"))?.scrollIntoView({
                behavior: "smooth"
            });
        });

        item.appendChild(link);
        list.appendChild(item);
    });

    tocContainer.appendChild(list);
}

function observeSections() {
    if (!tocContainer) return;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const link = tocContainer.querySelector(`a[href="#${entry.target.id}"]`);
            if (!link) return;
            if (entry.isIntersecting) {
                tocContainer.querySelectorAll("a").forEach(a => a.classList.remove("is-active"));
                link.classList.add("is-active");
            }
        });
    }, {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0.1
    });

    sections.forEach(section => observer.observe(section));
}

buildToc();
observeSections();
