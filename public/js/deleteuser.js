$("#deleteModal").on("show.bs.modal", function (event) {
  const deleteTarget = $(event.relatedTarget); // Button that triggered the modal
  const recipient = deleteTarget.data("whatever"); // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  const modal = $(this);
  modal.find("#deleteUser").text(recipient);
  modal.find("#deleteTarget").val(recipient);
});
