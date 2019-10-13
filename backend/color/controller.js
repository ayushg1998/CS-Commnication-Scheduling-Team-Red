module.exports = function(usecase) {

  /*
    @response {
      success: true,
      colors: Array<{hexCode: string, name: string}>
    }
  */
  async function getColors(req, res, next) {
    const colors = await usecase.getColors();
    res.send({success: true, colors});
  }

  return {
    getColors
  };
}