function MyHOC(Component, obj) {
  return (
    <div class="wrapper">
      <Component name={obj.name} />
    </div>
  );
}

export default MyHOC;
