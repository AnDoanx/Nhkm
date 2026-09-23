// four pivots, ONE point in
// space - a hand of cards,
// not four tilted boxes
slot.animate([
  { transform: `translate(${dx[i]}px) rotate(${ANG[i]}deg)` }
], {
  duration: 560,
  delay: i * 45
});
