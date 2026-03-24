---
title: "Modern Cryptography"
showTitle: false
description: "A nano-course in modern cryptography"
theme: "other"
section: "crypto"
sidebar:
  label: "Overview"
---


### A nano-course in modern cryptography
###### A Short Course
_Prof. Venkata Koppula, IIT Delhi_

<div class="callout callout-note">
<div class="callout-title">About the Course</div>
<div class="callout-body">

While cryptography has been around for centuries, since the middle of twentieth century, cryptography has gradually moved from 'art' to 'science'. Today, most cryptographic primitives/protocols come with a formal security proof. In this lecture series, we will discuss how to define security for cryptographic primitives, followed by constructions, security proofs (and vulnerabilities in real-world cryptosystems).

</div>
</div>

<div class="callout callout-note">
<div class="callout-title">About the Instructor</div>
<div class="callout-body">

Venkata Koppula is an Assistant Professor at IIT Delhi. His primary area of research is theoretical cryptography.

</div>
</div>

<div class="callout callout-note">
<div class="callout-title">Dates and Time</div>
<div class="callout-body">

- Dates: 21-26 December
- Format: Hybrid (over Zoom and at 7/101)
- Time: 5-6:30pm

</div>
</div>

<div class="callout callout-note">
<div class="callout-title">Target Audience</div>
<div class="callout-body">

Anyone with interest in theoretical computer science is welcome to attend. No cryptography background will be assumed.

</div>
</div>

<div class="callout callout-caution">
<div class="callout-body">

Join us on Zoom! Use [this link](https://iitgn-ac-in.zoom.us/j/99455739745?pwd=QU9vcWRsbkZMWmdTWFg0RVQxWGp0QT09) with the following details.

- Meeting ID: 994 5573 9745
- Passcode: 007700

</div>
</div>

<iframe data-tally-src="https://tally.so/embed/3N7GXQ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" loading="lazy" width="100%" height="214" frameborder="0" marginheight="0" marginwidth="0" title="CRYPTO Course Sign Up"></iframe><script>var d=document,w="https://tally.so/widgets/embed.js",v=function(){"undefined"!=typeof Tally?Tally.loadEmbeds():d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((function(e){e.src=e.dataset.tallySrc}))};if("undefined"!=typeof Tally)v();else if(d.querySelector('script[src="'+w+'"]')==null){var s=d.createElement("script");s.src=w,s.onload=v,s.onerror=v,d.body.appendChild(s);}</script>

---

### Teaching Plan

<div class="callout callout-tip">
<div class="callout-title">Lecture 1: How to define security?</div>
<div class="callout-body">

We will start with the most basic security setting: Alice and Bob share a secret key, and want to use this secret key for exchanging information securely. The cryptographic primitive that is used for this is called private-key encryption. In this first lecture, we will build towards a popular security definition (called security against 'chosen plaintext attacks') for private key encryption.

[Slides](https://raw.githubusercontent.com/neeldhara/quartosite/f0e4c36d1544387600c4012d16a602d29e9fc4e3/courses/2023/04-CRYPTO/L1-slides.pdf) | [Video](https://youtube.com/live/vIKXvEGLOJc?feature=share)

</div>
</div>

<details class="callout callout-note" open>
<summary class="callout-title">Lecture 1 Assignments</summary>
<div class="callout-body">

1. Show that any correct encryption scheme with perfect one-time security must have key space at least as large as the message space.

2. In the first lecture, we discussed one-time perfect security. This definition aims to capture the intuition that the adversary does not learn anything about the message if the scheme is one-time perfectly secure.

   Suppose an encryption scheme is one-time perfectly secure. Show that no adversary, given an encryption of a uniformly random message (using a uniformly random key), can compute the parity of the message bits (with probability 1). You can assume the message space is $n$-bit strings.

</div>
</details>

<div class="callout callout-tip">
<div class="callout-title">Lecture 2: The first construction Part I</div>
<div class="callout-body">

In this lecture, we will discuss how to build a private-key encryption scheme secure against chosen-plaintext attacks. We will then discuss how to optimise the ciphertext size (without compromising on security). We will conclude this lecture with a popular cryptographic standard (PKCS v1.5) which was proposed and implemented in the 90s.

[Slides](https://raw.githubusercontent.com/neeldhara/quartosite/f0e4c36d1544387600c4012d16a602d29e9fc4e3/courses/2023/04-CRYPTO/L2-slides.pdf) | [Video](https://youtube.com/live/i6BNTPqVF9E?feature=share)

</div>
</div>

<div class="callout callout-tip">
<div class="callout-title">Lecture 3: The first construction Part II</div>
<div class="callout-body">

In this lecture, we will discuss how to build a private-key encryption scheme secure against chosen-plaintext attacks. We will then discuss how to optimise the ciphertext size (without compromising on security). We will conclude this lecture with a popular cryptographic standard (PKCS v1.5) which was proposed and implemented in the 90s.

[Slides](https://raw.githubusercontent.com/neeldhara/quartosite/f0e4c36d1544387600c4012d16a602d29e9fc4e3/courses/2023/04-CRYPTO/L3-slides.pdf) | [Video](https://youtube.com/live/eE-6W5l2q3U?feature=share)

</div>
</div>

<div class="callout callout-tip">
<div class="callout-title">Lecture 4: The need for stronger security</div>
<div class="callout-body">

While the PKCS v1.5 satisfies security against 'chosen-plaintext attacks', it turns out that this security is not enough for the real-world! We will start this lecture with an attack on the PKCS v1.5 scheme, then discuss a stronger definition (called security against 'chosen ciphertext attacks'). This is now the 'gold standard' security definition for encryption schemes. In order to achieve this security, we require a new cryptographic primitive called 'message authentication codes'. We will define and build message auth. codes. Next, we will see how to use message authentication codes to achieve security against chosen-ciphertext attacks.

[Slides](https://raw.githubusercontent.com/neeldhara/quartosite/f0e4c36d1544387600c4012d16a602d29e9fc4e3/courses/2023/04-CRYPTO/L4-slides.pdf)

</div>
</div>

<div class="callout callout-tip">
<div class="callout-title">Lecture 5: Public key encryption</div>
<div class="callout-body">

One of the biggest innovations in the area of cryptography is the advent of public key cryptography. In this lecture, we will discuss some background on public key cryptography, followed by a construction for public key encryption.

[Slides](https://raw.githubusercontent.com/neeldhara/quartosite/f0e4c36d1544387600c4012d16a602d29e9fc4e3/courses/2023/04-CRYPTO/L5-slides.pdf)

</div>
</div>

<div class="callout callout-tip">
<div class="callout-title">Lecture 6: Digital signatures</div>
<div class="callout-body">

Digital signatures are an essential component in the public key infrastructure. We will discuss their role in public key infrastructure, as well as their importance as a standalone primitive). We will conclude this lecture with a construction of a digital signature scheme.

[Slides](https://raw.githubusercontent.com/neeldhara/quartosite/f0e4c36d1544387600c4012d16a602d29e9fc4e3/courses/2023/04-CRYPTO/L6-slides.pdf)

</div>
</div>

