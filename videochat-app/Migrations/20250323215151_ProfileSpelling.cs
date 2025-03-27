using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace videochat_app.Migrations
{
    /// <inheritdoc />
    public partial class ProfileSpelling : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Avaliability",
                table: "Profiles",
                newName: "Availability");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Availability",
                table: "Profiles",
                newName: "Avaliability");
        }
    }
}
